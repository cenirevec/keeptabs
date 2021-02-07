import { Browser } from "../components/shared.variables.mjs";
import { TabService } from "./tab.service.mjs";

export class DataService{
    constructor(){

    }

    static save(json,callback){
        Browser.storage.local.set(json, console.log);
        callback();
    }

    static load(moodID,callback){
        Browser.storage.local.get(moodID,function(json){
            //Check if the element exists
            if(!Object.keys(json).length)
                json = null;

            callback(json);
        });
    }

    static clear(moodID){
        //console.log(moodID);
        Browser.storage.local.clear(console.log);
        TabService.render();
    }
}