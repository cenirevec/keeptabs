/** GLOBAL VARIABLES */
/*      Make browser object accesible on Chrome and Firefox     */
var browser = (browser != undefined) ? browser : chrome;
var navigatorName = navigator.userAgent.split(" ")[navigator.userAgent.split(" ").length - 1];

/** HANDLERS */
/*   Read tabs at launch    */
//Example code
//M: Need to be changed to take the KeepTabs URL more than the unactive tabs 
//browser.tabs.query({currentWindow: true, active: false},GetAllTabs);




/*   Example function   */
function NextFunction(){
    
}

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