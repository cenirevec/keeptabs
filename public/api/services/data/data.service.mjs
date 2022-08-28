import { navigatorName } from "../../shared.variables.mjs";

export class DataService{

    static model = {}
    static mutex = {}

    static defaultData = { model:
        {
            meta:{},
            categories:{
                "0": {
                    "meta":{
                        expiration: 30*24*3600*1000,
                        name: "main"
                    },
                    "tabGroups":[]
                },
                "1": {
                    "meta":{
                        expiration: 30*24*3600*1000,
                        name: "test"
                    },
                    "tabGroups":[]
                }
            }
        }
    }


    constructor(){
        this.load = this.load.bind(this);
        this.save = this.save.bind(this);
        //this.load();
    }

    /**
     * Save the tabs in browser's data
     * @param {function} callback Function to launch after saving data
     * @todo Make it evolve to save only the modified parts 
     */
    static save(callback){
        //Get a model to save
        let data = (DataService.model == {} || DataService.model?.meta == undefined)? 
            this.defaultData: JSON.parse(JSON.stringify({model:DataService.model}));

        
        //Save function according to the chosen browser
        if(navigatorName == "Firefox"){
            browser.storage.local.set(data);
            if(callback != undefined)
                callback();
        }else{
            if(navigatorName != "Chrome"){
                console.warn("Ths browser have not been tested, stay prudent")
            }
            if(callback == undefined)
                callback = ()=>{};
            chrome.storage.local.set(data,callback);
        }
    }

    static patch(){

    }

    /**
     * Load tabs from the bowser's storage
     * @param {function} callback function to launch after loading
     */
    static load(callback){
        //Allow to give an empty function
        if(callback == undefined)
            callback = ()=>{}

        if(navigatorName == "Firefox"){
            let promise = browser.storage.local.get("model");

            promise.then(json=>{
                //Check if the element exists
                DataService.model = 
                    (!Object.keys(json).length) ? this.defaultData.model : json.model;
    
                callback(DataService.model);
            })
        }else{
            if(navigatorName != "Chrome"){
                console.warn("This browser have not been tested, stay prudent")
            }

            chrome.storage.local.get("model",function(json){
                //Check if the element exists
                DataService.model = 
                    (!Object.keys(json).length) ? this.defaultData.model : json.model;
                
                callback(DataService.model);
            });
        }
    }

    /**
     * Clearing all the moods and their content
     */
    static clear(){
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

    static lockMutex(){
        
    }

    static unlockMutex(){
       // this.
    }

    checkForAvailability(){

    }

    // Utiliser la propriété onChange du local storage pour vérifier si la fenêtre est toujours présente
    freeMutex(){

    }
}

export default DataService;