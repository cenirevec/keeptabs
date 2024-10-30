import { IconReferencer } from "../../../../src/models/iconReferencer.model.js";
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

    constructor(services) {
        this.services = services;

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
                console.warn("This browser have not been tested, stay prudent");
            }
            if (callback == undefined)
                callback = () => { };
            chrome.storage.local.set(modelToSave, callback);
        }
    }

    patch(model) {
        let modelCopy;
        try {
            modelCopy = JSON.parse(JSON.stringify(model));

            //Initializing version info
            let currentVersionId = patchList.versions.findIndex(version => version == modelCopy?.meta?.version ?? "1.0.0")
            let versionsToLoad = JSON.parse(JSON.stringify(patchList.versions))
                .map((value, index) => index)
                .filter((value, index) => index > currentVersionId);

            // Function to apply to a level of the tree
            function runOperation (patchBranch, levelObject) {
                //Return if there are no operation to run
                if (!patchBranch?.operations) return;

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
                                console.error(levelObject);
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

            // // Recursive function to read the patch JSON tree
            // let goFurther = (patchBranch, modelPath, level = 1) => {
            //     // Initialize next recursion variable
            //     let nextModelPath = modelPath;
            //     console.log(patchBranch,modelPath,patchBranch.path)
                

            //     if (patchBranch.path) {
            //         // Define which object to use for the next recursion
            //         let path = patchBranch.path;
            //         //Create the property indicated by the path if necessary
            //         if (modelPath[path] == undefined) {
            //             modelPath[path] = new Object();
            //         }

            //         nextModelPath = modelPath[path];
            //         //console.log(patchBranch)

            //         //Make patches to the saved data model
            //         if (patchBranch?.operations) {
            //             runOperation(patchBranch, nextModelPath);
            //         }
            //         // Run functions on the children objects
            //         if (patchBranch?.forEach){
            //             //console.log("for each")
            //             Object.keys(nextModelPath).forEach(keys => {
            //                 let children = nextModelPath[keys];
            //                 //console.log(patchBranch,children,nextModelPath)
            //                 runOperation(patchBranch.forEach, children);
            //                 if(patchBranch.forEach?.forEach){
            //                     let grandchildren = children[patchBranch.forEach.forEach.path]; //children[patchBranch.forEach];
            //                     //console.log(children,grandchildren,patchBranch.forEach.forEach.path)
            //                     goFurther(patchBranch.forEach, grandchildren, level + 1);
            //                 }
            //             })
            //         }
            //     }

            //     // PREPARE ITERATION : Check if the code can be repeated
            //     // When we are at the root of the file
            //     if (patchBranch.hasOwnProperty("patchs")) {
            //         goFurther(patchBranch.patchs, nextModelPath, level + 1)
            //     }
            //     /** When the branch has many properties to check or update */
            //     else if (Array.isArray(patchBranch)) {
            //         patchBranch.forEach((childPathBranch) =>
            //             goFurther(childPathBranch, nextModelPath, level + 1));
            //     }
            // }
            
            function goFurther(patches,model){
                //Traitement du patch
                if(Array.isArray(patches)){
                    patches.forEach(_patch=>{
                        let _model = model[_patch.path];
                        //model.visited += "case 1" +_patch.path;
                        //Create the model branch if doesn't exists
                        if(!_model){
                            model[_patch.path] = {};
                            _model = model[_patch.path];
                        }
                        // Run the operation as defined in patches file
                        runOperation(_patch, _model);
                        
                        // Go to the next step
                        goFurther(_patch,_model);
                    })
                }
                else if(patches.forEach || patches.children){
                    
                    let _patch = (patches.forEach) ? patches.forEach: patches.children;
                    
                    if (patches.forEach) {
                        Object.keys(model).forEach(key=>{
                            // Model used in next iteration
                            let _model = model[key];
                            // Run the operation as defined in patches file
                            runOperation(_patch, _model);

                            // Go to the next step
                            goFurther(_patch,_model);
                        })

                    } else {
                       // Go to the next step
                       goFurther(_patch,model);
                    }
                   // model.visited += "case 2";
                }
                else{
                    // Run the operation as defined in patches file
                    runOperation(patches, model);
                    //
                    //model.visited += "case 3";
                }
            }

            // ENTRY POINT !!!!
            // Run the recursive function
            goFurther(patchList.patchs, modelCopy);

            modelCopy.meta.version = patchList.versions[patchList.versions.length - 1];
            console.debug("Patched version", JSON.parse(JSON.stringify(modelCopy)))
            return modelCopy;
        } catch (error) {
            console.log(modelCopy)
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
                // Define a icon referencer to register icons when they appears
                this.services.setIconReferencer();

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
                // Define a icon referencer to register icons when they appears
                let referencer = new IconReferencer(this.model.icons);
                this.services.setIconReferencer(referencer);

                callback(this.model);
            });
        }
    }

    /**
     * Clearing all the moods and their content
     */
    clear() {
        Services.data.model = JSON.parse(JSON.stringify(defaultModel))
        Services.data.save();
        console.log("cleared");
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
                });

                this.mergeIconReferences(content.icons);

                //Services.main.reload();
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
                category.meta = toMerge.meta;
            }
        } else {
            console.error("The file data has been corrupted")
        }
    }

    /**
     * Icon referencer
     * @param {IconReferencer} toMerge icon referencer to merge
     */
    mergeIconReferences(toMerge){
        this.model.icons = toMerge;
    }

    // ---------------- SETTINGS ------------- //

    /**
     * Get a setting
     * @param {*} reference JSON Path to find the setting
     * @returns 
     */
    getSetting(reference) {
        let leaf = this.model.meta.settings;
        reference.split(".").forEach((key) => {
            if (leaf[key] != undefined) {
                leaf = leaf[key];
            } else {
                console.error("A wrong reference to setting option has been given.\n key value:" + key + " is not found")
            }
        })
        return leaf;
    }

    /**
     * Set a setting
     * @param {*} reference JSON Path to find the setting
     * @returns 
     */
    setSetting(reference, value) {
        let leaf = this.model.meta.settings;
        let referenceArray = reference.split(".");
        referenceArray.forEach((key, index) => {
            if (leaf[key]) {
                if (index < referenceArray.length - 1) {
                    leaf = leaf[key];
                } else {
                    leaf[key] = value;
                }
            } else {
                console.error("A wrong reference to setting option has been given")
            }
        })
        return leaf;
    }

    // --------------- MANAGE ALIASES ------------ //

    /**
     * Check if an alias exists
     * @param {string} alias Given alias 
     */
    hasAlias(alias) {
        return Services.data.model.meta.shortcuts[alias] !== undefined;
    }

    /**
     * Get all the of aliases
     * @param {string} alias Given alias 
     */
    getAliases() {
        return Services.data.model.meta.shortcuts;
    }


    /**
     * Get the list of filter associated to an alias
     * @param {string} alias Given alias 
     */
    getValuesForAlias(alias) {
        return Services.data.model.meta.shortcuts[alias]?.value ?? [];
    }

    /**
    * Create an alias
    * @param {string} alias Given alias 
    */
    addAlias(alias) {
        Services.data.model.meta.shortcuts[alias] = { value: [] }
        Services.data.save();
    }

    /**
     * Set a list of filter associated to an alias
     * @param {string} alias Given alias 
     */
    setValuesForAlias(alias, values) {
        Services.data.model.meta.shortcuts[alias].value = values;
        Services.data.save();
    }

    /**
     * Remove an alias for the aliases list
     * @param {string} alias Given alias 
     */
    removeAlias(alias) {
        delete Services.data.model.meta.shortcuts[alias];
        Services.data.save();
    }

    /**
     * Rename an alias
     * @param {string} oldAlias old alias name
     * @param {string} newAlias new alias name
     */
    renameAlias(oldAlias, newAlias) {
        if (this.hasAlias(oldAlias) && !this.hasAlias(newAlias)) {
            Services.data.model.meta.shortcuts[newAlias] = {
                value: this.getValuesForAlias(oldAlias)
            }
            this.removeAlias(oldAlias);
            return true;
        }
        return false;
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