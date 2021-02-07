//This module will contain an abstraction of all browser API invocated
//In order to simplify the access to them

export class BrowserService{
    static navigatorName = "";
    static tabs = browser.tabs;

    constructor(){
        if (chrome != undefined) {
            navigatorName = "Chrome";
            
            this.tabs = chrome.tabs;
        } else {
            navigatorName = "Firefox";
            this.tabs = browser.tabs;
        }

    }

    static storage = {
        "local" : {
            "get": function(id,callback){

            },
            "set": function(json,callback){
                if (navigatorName=="Chrome") {
                    chrome.storage.local.set(json, callback);
                }else{
                    browser.storage.local.set(json).then(callback);
                }
            },
            "remove": function(id,callback){

            }
        }
    }


}