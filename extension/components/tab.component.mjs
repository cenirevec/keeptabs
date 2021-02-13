import { TabService } from "../services/tab.service.mjs";
import { Browser } from "./shared.variables.mjs";

var rootURL = window.location.href.split("/keeptabs")[0];

var Imgs = {
    extension : rootURL + "/media/ico-48.png",
    default : rootURL + "/media/ico-48.png"
}

export class Tab{
    static createdTabs = 0;
    constructor(tab){
        this.id = tab.id;
        this.url = tab.url;
        this.title = tab.title;
        this.favicon = (tab.favicon != undefined)?tab.favicon : tab.favIconUrl;
        this.lastAccessed = 
            (tab.lastAccessed != undefined)? tab.lastAccessed : Date.now();
        this.groupId = -1;
        this.searchId = this.createdTabs++;
        
        this.isHidden = false;
    }

    render(context){
        if (this.isHidden) {
            return null;
        }

        let el = document.createElement("li");
        el.className = "list-group-item list-group-item-action";
        el.key = this.id;
        
        let img = document.createElement("img");
        let link = document.createElement("a");
        let options;
        let lastAccessed = document.createElement("small");

       
        img.src = this.favicon;
        if (img.src.indexOf("chrome-extension") != -1) {
            img.src = Imgs.extension;
        }


        if(context != "current") link.href = this.url;
        link.innerHTML = this.title;
        link.target = "_blank";
        link.addEventListener("click",event => {
            let tabID = event.target.parentNode.key;
            let tabGroupID = parseInt(event.target.parentNode.parentNode.id);
            let moodID = event.target.parentNode.parentNode.parentNode.id;

            TabService.removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID);
        })
        lastAccessed.innerHTML = this.lastAccessed;

        el.appendChild(img);
        el.appendChild(link);
        el.appendChild(lastAccessed);

        //el.innerHTML=`<img src="${this.favicon}"><a href="${this.url}">${this.title}</a><small>last:${this.lastAccessed}</small>`
        return el;
    }

    static getTabsFromArray(tabArray){
        if (tabArray == null) {
            return null;
        }
        let elements = new Array();
        let index = 0;
        tabArray.forEach(element => {
            if(element != null){
                element.id = index;
                elements.push(new Tab(element));
                index++;
            }
        });
        return elements;
    }

    /** Open the tab
        Returns if the tab is opened of not */
    open(options){
        if (this.isHidden) {
            return false;
        } else {
            options = (options == undefined || options == null)? {}:options;
            options["url"] = this.url;

            Browser.tabs.create(options);
            return true;
        }
    }

    match(regexp){
        //if(this.url.indexOf(regexp) + this.title.search(regexp) >= -2){
        //regexp = new RegExp(regexp,i);
        let text = this.url.concat(" "+this.title);
        //console.log(text);
        if(text.search(regexp) > -1){
            return true;
        }else{
            return false;
        }
    }

    show(boolean){
        this.isHidden = !boolean;
    }

} 

export class TabSet{
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