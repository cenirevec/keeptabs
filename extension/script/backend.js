console.log("Back-end");

/*Make browser object accesible on Chrome and Firefox*/
var browser = (browser != undefined) ? browser : chrome;
var navigatorName = navigator.userAgent.split(" ")[navigator.userAgent.split(" ").length - 1];

function logTabs(tabs) {
    let tab = tabs[0]; // Safe to assume there will only be one result
    console.log(tab);
}

//If browser used is Firefox
if (navigatorName.indexOf("Firefox") == -1) {
    browser.tabs.query({currentWindow: true, active: false},GetAllTabs);
} else {
    browser.tabs.query({currentWindow: true, active: false}).then(GetAllTabs, console.error);
}

console.log(browser)


function GetAllTabs(tabs){
    console.log(tabs);
    //Security : check if the object receved is a tab object
    let tabList = new Array();
    for (let i = 0; i < tabs.length; i++) {
        //const tab = tabs[i];
        tabList.push(new Tab(tabs[i]));
    }
    console.log(tabList);
}

function NextFunction(){
    
}

class Tab{
    constructor(tab){
        this.url = tab.url;
        this.title = tab.titre;
        this.favicon = tab.favIconUrl;
        this.lastAccessed = tab.lastAccessed;
    }
}