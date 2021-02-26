import { TabService } from "../services/tab.service.mjs";
import { timeSince } from "./shared.variables.mjs";
import { Browser } from "./shared.variables.mjs";

var rootURL = window.location.href.split("/keeptabs")[0];

var Imgs = {
    extension : rootURL + "/media/ico-48.png",
    default : rootURL + "/media/ico-48.png"
}

export class Tab{
    constructor(tab){
        this.id = tab.id;
        this.url = tab.url;
        this.title = tab.title;
        this.favicon = (tab.favicon != undefined)?tab.favicon : tab.favIconUrl;
        this.lastAccessed = 
            (tab.lastAccessed != undefined)? tab.lastAccessed : Date.now();
        this.groupId = -1;
        
        this.isHidden = false;
        this.selected = false;
    }

    render(context){
        if (this.isHidden) {
            return null;
        }

        let el = document.createElement("li");
        el.className = "list-group-item list-group-item-action";
        if(!this.selected && TabService.mode.selection)
            el.className += " unselected";
        el.key = this.id;
/*
        el.addEventListener("mousedown",event=>{
            //console.log(TabService.getTabByLiElement(event.target));
            console.log(this);
        });*/
        
        let img = document.createElement("img");
        let link = document.createElement("a");
        let options;
        let lastAccessed = document.createElement("small");

       
        img.src = this.favicon;
        if (img.src.indexOf("chrome-extension") != -1) {
            img.src = Imgs.extension;
        }
        
        img.addEventListener("click",event=>{
            this.toggleSelected();
        })
        img.title = "Click to select this link";
        

        if(context != "current" || (!this.selected && TabService.mode.selection))
            link.href = this.url;
        link.innerHTML = this.title;

        if (!TabService.mode.selection) {
            link.target = "_blank";
            link.addEventListener("click",event => {
                let tabID = event.target.parentNode.key;
                let tabGroupID = parseInt(event.target.parentNode.parentNode.id);
                let moodID = event.target.parentNode.parentNode.parentNode.id;

                TabService.removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID);
            })
        }
        
        lastAccessed.innerHTML = timeSince(new Date(this.lastAccessed));

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
        if (this.isHidden || (!this.selected && TabService.mode.selection)) {
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

    toggleSelected(boolean){
        this.selected = (boolean != undefined)? boolean : !this.selected;

        if (this.selected) {
            TabService.changeNumberOfSelectedTabs(1);
        } else {
            TabService.changeNumberOfSelectedTabs(-1);
        }
    }

    compareTo(tab){
        let identifier1 = this.id + "" + this.groupId + "" + this.lastAccessed;
        let identifier2 = tab.id + "" + tab.groupId + "" + tab.lastAccessed;
        console.log(identifier1,identifier2,identifier1 == identifier2)
        return identifier1 == identifier2;
    }

    findIn(array){
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.compareTo(this)){
                return index;
            }
        }
        return -1;
    }
} 