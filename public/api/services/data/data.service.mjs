import { Services } from "../../../../src/services.jsx";
import { currentDataVersion } from "../../shared.variables.mjs";
import { navigatorName } from "../../shared.variables.mjs";

export class DataUploadMethodEnum{
    MERGE = 'merge';
    ADD = 'add';
    REPLACE = 'replace';
}

export class DataService{

    mutex = {}

    defaultData = { 
        model:
        {
            meta:{
                version: "2.0.0"
            },
            categories:{
                "0": {
                    "meta":{
                        expiration: 30*24*3600*1000,
                        name: "temporary",
                        translationLabel: "categories.names.temporary"
                    },
                    "tabGroups":[]
                }
            }
        }
    }

    model = JSON.parse(JSON.stringify(this.defaultData))

    constructor(){
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
    save(callback){
        //Get a model to save
        let modelToSave = (this.model == {} || this.model?.meta == undefined)? //If model not set or set wrongly
            this.defaultData: JSON.parse(JSON.stringify({model:this.model}));
        
        //Save function according to the chosen browser
        if(navigatorName == "Firefox"){
            browser.storage.local.set(modelToSave).then(()=>{
                        if(callback != undefined)
                            callback(this.model);
                   })
                   .catch((error)=>console.error(error))
        }else{
            if(navigatorName != "Chrome"){
                console.warn("This browser have not been tested, stay prudent")
            }
            if(callback == undefined)
                callback = ()=>{};
            chrome.storage.local.set(modelToSave,callback);
        }
    }

    patch(){
        console.log(content)
        return content;
    }

    /**
     * Load tabs from the bowser's storage
     * @param {function} callback function to launch after loading
     */
    load(callback){
        //Allow to give an empty function
        if(callback == undefined)
            callback = ()=>{}

        if(navigatorName == "Firefox"){
            let promise = browser.storage.local.get("model");

            promise.then(json=>{
                //Check if the element exists
                this.model = 
                    (!Object.keys(json).length) ? this.defaultData.model : json.model;
    
                callback(this.model);
            })
        }else{
            if(navigatorName != "Chrome"){
                console.warn("This browser have not been tested, stay prudent")
            }

            chrome.storage.local.get("model",function(json){
                //Check if the element exists
                this.model = 
                    (!(Object.keys(json).length) || !json ) ? this.defaultData.model : json?.model;
                callback(this.model);
            });
        }
    }

    /**
     * Clearing all the moods and their content
     */
    clear(){
        // console.info("Clearing mood data on "+navigatorName);
        if(navigatorName == "Firefox"){
            browser.storage.local.clear();
        }else{
            if(navigatorName != "Chrome"){
                console.warn("Ths browser have not been tested, stay prudent")
            }
            chrome.storage.local.clear(null);
        }
    }

    /**
     * Upload saved tabs from a file
     * @param {Object} content Content of the save
     * @param {DataUploadMethodEnum} method Indicates how to add the data
     */
    upload(content,method = DataUploadMethodEnum.MERGE){
        if(currentDataVersion != content?.meta?.version){
            //content = this.patch(content);
        }

        switch (method) {
            case DataUploadMethodEnum.MERGE:
                let importedCategories = Object.keys(content.categories).map(categoryid=>content.categories[categoryid]); 
                importedCategories.forEach(category=>{
                    this.mergeWithCategory(category);
                    console.log(this.model,Services.data.model)
                    console.log("this.model.categories[0].tabGroups",this.model.categories["0"].tabGroups)
                })
                //Services.data.save();
                
                break;
            case DataUploadMethodEnum.REPLACE:
                this.model = content;
                break;
            default:
                break;
        }
    }

    /**
     * Download the saved tabs
     */
    download(){
        var data = JSON.stringify(this.model);
        var a = document.createElement("a");
        var file = new Blob([data], {type: 'application/json'});
        a.href = URL.createObjectURL(file);

        function addLeadingZeros(n) {
            if (n <= 9) {
              return "0" + n;
            }
            return n
          }

        let currentDatetime = new Date()
        //console.log(currentDatetime.toString());
        let formattedDate = currentDatetime.getFullYear() + "-" + addLeadingZeros(currentDatetime.getMonth() + 1) + "-" + addLeadingZeros(currentDatetime.getDate()) + " " + addLeadingZeros(currentDatetime.getHours()) + ":" + addLeadingZeros(currentDatetime.getMinutes()) + ":" + addLeadingZeros(currentDatetime.getSeconds())
        //console.log(formattedDate);

        a.download = `keeptabs-data_${formattedDate}.json`;
        a.click();
    }

    /**
     * Merge categories
     * @param {Object} toMerge Category from the file to merge or add
     */
    mergeWithCategory(toMerge){
        //console.log(toMerge);
        //Check if the category exists
        if(toMerge?.meta?.name){
            let category = Services.category.getByName(toMerge?.meta?.name);
            if (category) {
                toMerge.tabGroups.forEach(tabGroup=>{
                    //console.log(tabGroup,category)
                    //Add all tabgroups
                    category.tabGroups.push(tabGroup)
                })
                //category.tabGroups = category.tabGroups.concat(toMerge.tabGroups);
                //OK //console.log("toMerge.tabGroups",toMerge.tabGroups)
                //Services.data.save();
            } else {
                //If not
                category = Services.category.create(toMerge.meta.name,false);
                category.tabGroups = toMerge.tabGroups;
               // console.log(category,toMerge)
            }
        }else{
            console.error("The file data has been corrupted")
        }
    }
}

export class DataOperationService{

    constructor(){
        
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

    lockMutex(){
        
    }

    unlockMutex(){
       // this.
    }

    checkForAvailability(){

    }

    // Utiliser la propriété onChange du local storage pour vérifier si la fenêtre est toujours présente
    freeMutex(){

    }
}

export default DataService;