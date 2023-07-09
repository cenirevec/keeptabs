import { Services } from "../../../../src/services.jsx";
import { defaultModel } from "../../defaultData.mjs";
import patchList, { PatchListPath } from "../../patch.mjs";
import { currentDataVersion } from "../../shared.variables.mjs";
import { navigatorName } from "../../shared.variables.mjs";

export class DataUploadMethodEnum {
    MERGE = 'merge';
    ADD = 'add';
    REPLACE = 'replace';
}

export class ProgressionStatus {
    done = 0;
    total = 0;
    description = "";
    errors = null;

    increment(toAdd = 1) {
        this.done += toAdd;
    }

    reset() {
        this.done = 0;
    }
}

export class DataService {

    mutex = {}

    model = JSON.parse(JSON.stringify(defaultModel))

    constructor() {
        this.load = this.load.bind(this);
        this.save = this.save.bind(this);

        this.download = this.download.bind(this);
        this.clear = this.clear.bind(this);
    }

    /**
     * Save the tabs in browser's data
     * @param {function} callback Function to launch after saving data
     * @todo Make it evolve to save only the modified parts 
     */
    save(callback) {
        //Get a model to save
        let modelToSave = (this.model == {} || this.model?.meta == undefined) ? //If model not set or set wrongly
        defaultModel : JSON.parse(JSON.stringify({ model: this.model }));

        //Save function according to the chosen browser
        if (navigatorName == "Firefox") {
            browser.storage.local.set(modelToSave).then(() => {
                if (callback != undefined)
                    callback(this.model);
            })
                .catch((error) => console.error(error))
        } else {
            if (navigatorName != "Chrome") {
                console.warn("This browser have not been tested, stay prudent")
            }
            if (callback == undefined)
                callback = () => { };
            chrome.storage.local.set(modelToSave, callback);
        }
    }

    patch(model) {
        try {
            let modelCopy = JSON.parse(JSON.stringify(model));

            //Initializing version info
            let currentVersionId = patchList.versions.findIndex(version => version == modelCopy?.meta?.version ?? "1.0.0")
            let versionsToLoad = JSON.parse(JSON.stringify(patchList.versions))
                .map((value, index) => index)
                .filter((value, index) => index > currentVersionId);

            // Function to apply to a level of the tree
            let applyTabGroupsPatch = (patchBranch, levelObject) => {
                let operationList = []
                // Creating the list of operation to perform by comparing the current version and the saved data version
                versionsToLoad.forEach(versionId => {
                    //console.debug("patch.applyTabGroupsPatch",patchBranch.operations)
                    if (patchBranch.operations[versionId]) {
                        operationList.push(patchBranch.operations[versionId]);
                    }
                })

                // Function to perform these operations
                let executeOperationsOn = (levelObject) => {
                    operationList.forEach(operationToPerform => {
                        if (operationToPerform) {
                            try {
                                operationToPerform(levelObject);
                            } catch (error) {
                                console.error("An operation has not been correctly defined", operationToPerform, error)
                            }
                        }
                    });
                }

                // Perform the filtered operations
                if (Array.isArray(levelObject)) {
                    levelObject.forEach(levelSubObject => {
                        //Perform the operation on the sub-element
                        executeOperationsOn(levelSubObject);
                    });
                } else {
                    //Perform the operation on the element
                    executeOperationsOn(levelObject);
                }
            }

            // Recursive function to read the patch JSON tree
            let goFurther = (patchBranch, modelPath, arrayIndex = 0, level = 1) => {
                // Initialize next recursion variable
                let nextModelPath = modelPath;

                if (patchBranch.path) {
                    // Define which object to use for the next recursion
                    let path = patchBranch.path;
                    if (path == PatchListPath.OBJECT_FOREACH) {
                        path = arrayIndex;
                    }
                    nextModelPath = modelPath[path];

                    //Make patches to the saved data model
                    if (patchBranch?.operations) {
                        applyTabGroupsPatch(patchBranch, nextModelPath);
                    }
                }

                // Check if the function can be repeated
                if (patchBranch.hasOwnProperty("patchs")) {
                    goFurther(patchBranch.patchs, nextModelPath, 0, level + 1)
                }
                else if (patchBranch.hasOwnProperty("children")) {
                    goFurther(patchBranch.children, nextModelPath, 0, level + 1)
                }
                else if (Array.isArray(patchBranch)) {
                    patchBranch.forEach((childPathBranch, arrayIndex) =>
                        goFurther(childPathBranch, nextModelPath, arrayIndex, level + 1));
                }
            }
            // Run the recursive function
            goFurther(patchList, modelCopy);

            modelCopy.meta.version = patchList.versions[patchList.versions.length -1];
            return modelCopy;
        } catch (error) {
            console.error("Something wrong happened during the patch of the data. Previous data has been restored", error)
            return model;
        }
    }

    /**
     * Load tabs from the bowser's storage
     * @param {function} callback function to launch after loading
     */
    load(callback) {
        //Allow to give an empty function
        if (callback == undefined)
            callback = () => { }

        if (navigatorName == "Firefox") {
            let promise = browser.storage.local.get("model");

            promise.then(json => {
                //Check if the element exists
                this.model =
                    (!Object.keys(json).length) ? defaultModel.model : json.model;
                //Patch the data according to the version
                if (currentDataVersion != this.model?.meta?.version) {
                    this.model = this.patch(this.model);
                    this.save();
                }
                
                callback(this.model);
            })
        } else {
            if (navigatorName != "Chrome") {
                console.warn("This browser have not been tested, stay prudent")
            }

            chrome.storage.local.get("model", function (json) {
                //Check if the element exists
                this.model =
                    (!(Object.keys(json).length) || !json) ? defaultModel.model : json?.model;
                //Patch the data according to the version
                if (currentDataVersion != this.model?.meta?.version) {
                    this.model = this.patch(this.model);
                    this.save();
                }

                callback(this.model);
            });
        }
    }

    /**
     * Clearing all the moods and their content
     */
    clear() {
        if (navigatorName == "Firefox") {
            browser.storage.local.clear();
        } else {
            if (navigatorName != "Chrome") {
                console.warn("Ths browser have not been tested, stay prudent")
            }
            chrome.storage.local.clear(null);
        }
    }

    /**
     * Upload saved tabs from a file
     * @param {Object} content Content of the save
     * @param {function} onProgressHandler Function to handle the import progression
     * @param {DataUploadMethodEnum} method Indicates how to add the data
     */
    upload(content, onProgressHandler = () => { }, method = DataUploadMethodEnum.MERGE) {
        if (currentDataVersion != content?.meta?.version) {
            content = this.patch(content);
        }
        let status = new ProgressionStatus;

        switch (method) {
            case DataUploadMethodEnum.MERGE:
                let importedCategories = Object.keys(content.categories).map(categoryid => content.categories[categoryid]);
                importedCategories.forEach(category => {
                    this.mergeWithCategory(category);
                })
                Services.data.save();
                break;
            case DataUploadMethodEnum.REPLACE:
                this.model = content;
                Services.data.save();
                break;
            default:
                break;
        }
    }

    /**
     * Download the saved tabs
     */
    download() {
        var data = JSON.stringify(this.model);
        var a = document.createElement("a");
        var file = new Blob([data], { type: 'application/json' });
        a.href = URL.createObjectURL(file);

        function addLeadingZeros(n) {
            if (n <= 9) {
                return "0" + n;
            }
            return n
        }

        let currentDatetime = new Date();
        let formattedDate = currentDatetime.getFullYear() + "-" + addLeadingZeros(currentDatetime.getMonth() + 1) + "-" + addLeadingZeros(currentDatetime.getDate()) + " " + addLeadingZeros(currentDatetime.getHours()) + ":" + addLeadingZeros(currentDatetime.getMinutes()) + ":" + addLeadingZeros(currentDatetime.getSeconds())

        a.download = `keeptabs-data_${formattedDate}.json`;
        a.click();
    }

    /**
     * Merge categories
     * @param {Object} toMerge Category from the file to merge or add
     */
    mergeWithCategory(toMerge) {
        //Check if the category exists
        if (toMerge?.meta?.name) {
            let category = Services.category.getByName(toMerge?.meta?.name);
            if (category) {
                toMerge.tabGroups.forEach(tabGroup => {
                    //Add all tabgroups
                    category.tabGroups.push(tabGroup)
                })
            } else {
                //If not
                category = Services.category.create(toMerge.meta.name, false);
                category.tabGroups = toMerge.tabGroups;
            }
        } else {
            console.error("The file data has been corrupted")
        }
    }
}

export class DataOperationService {

    constructor() {

    }
    //Nécessite l'élaboration de diagrammes à états
    /*
     * Prendre en compte le fait que:
        - des modifications peuvent arriver le temps que le mutex libère le DataService.save()
            - il n'est pas possible de juste réécraser car les nouveaux ajouts seraient perdus, 
            il faudra donc essayer de patcher le précédent model avant la sauvegarde. ordre:
            piste 1 : patch -> modification -> save
            piste 2 (essayer de moins créer de ralentissement): 
                remplacer la save monolitique en bloc quoi par une save par patch, voir le fonctionnement de git
                    - crainte: avoir quelque chose de complètement dégueulasse et incohérent
            piste 3 : ajouter une fonction patch que permettra d'appliquer le changement en question lors que le mutex sera libérer
            piste 4 : avoir une copie contenant uniquement les modifications et travailler sur le modèle incomplet
                 puis ensuite le save en ajoutant le patch
        - 
     */

    lockMutex() {

    }

    unlockMutex() {
        // this.
    }

    checkForAvailability() {

    }

    // Utiliser la propriété onChange du local storage pour vérifier si la fenêtre est toujours présente
    freeMutex() {

    }
}

export default DataService;