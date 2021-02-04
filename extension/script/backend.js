/** GLOBAL VARIABLES */
/*      Make browser object accesible on Chrome and Firefox     */
var navigatorName;
var browser = (browser != undefined)? browser : chrome;
if (chrome != undefined) {
    navigatorName = "Chrome";
} else {
    navigatorName = "Firefox";
}


/** HANDLERS */
/*   Read tabs at launch    */
//Example code
//M: Need to be changed to take the KeepTabs URL more than the unactive tabs 
//browser.tabs.query({currentWindow: true, active: false},GetAllTabs);




/*   Example function   */
function NextFunction(){
    
}

class DataManagement{
    constructor(){

    }

    save(json){
        chrome.storage.local.set(json, console.log);
    }

    load(moodID,callback){
        chrome.storage.local.get(moodID,function(json){
            //Check if the element exists
            if(!Object.keys(json).length)
                json = null;
            callback(json);
        });
    }

    clear(moodID){
        chrome.storage.local.remove(moodID);
    }
}

var data = new DataManagement();
/*data.save({"key":JSON.stringify([{"key":4,"bonjour":5},{"key":3,"bonjour":7}])});
data.load("key",console.log)*/
/** RENDERING */

/** REACT COMPONENTS */

/** OBJECTS */
/**     Tab object       */
class Tab{
    constructor(tab){
        this.url = tab.url;
        this.title = tab.titre;
        this.favicon = tab.favIconUrl;
        this.lastAccessed = tab.lastAccessed;
    }
}

class TabSet{
    constructor(tabs){
        if(Array.isArray(tabs)){
            //Create a brand new TabSet
            this.children = tabs;        // List of tabs
            this.length = tabs.length;   //Number of children
            this.lastUpdate = "";       //To be defined
            this.name = "";             //Name of the tab set
        }else{
            //Create a TabSet object based on JSON data
            this.children = tabs.children;
            this.length = tabs.length;
            this.lastUpdate = tabs.lastUpdate;
            this.name = tabs.name;
        }
    }
}

/** INITIALIZATION */
//Create a Tab Management object
var tab = new TabManagementObject();

data.load("_init",tab.loadMoods);