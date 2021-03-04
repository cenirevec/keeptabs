import { TabService } from "../services/tab.service.mjs";
import { timeSince } from "./shared.variables.mjs";
import { Browser } from "./shared.variables.mjs";

var rootURL = window.location.href.split("/keeptabs")[0];

var Imgs = {
    extension : rootURL + "/media/ico-48.png",
    default : rootURL + "/media/ico-48.png"
}

var uniqueId = 0;
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

        this.target = document.createElement("li");
        this.target.className = "list-group-item list-group-item-action";
        this.uniqueId = uniqueId++;
    }

    render(context){
        if (this.isHidden || this.target == null) {
            if(this.target == null){
                return null;
            }else{
                this.target.className += " hidden";
            }
        }else{
            this.target.className = this.target.className.split(" hidden").join("");
        }

        if(!this.selected && TabService.mode.selection){
            this.target.className += " unselected";
        }else{
            this.target.className = this.target.className.split(" unselected").join("");
            if(!TabService.mode.selection){
                this.selected = false;
            }
        }

        this.target.key = this.id;

        if(this.target.innerHTML == ""){

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
                    let tabGroupID = parseInt(event.target.parentNode.parentNode.id.split('gid')[1]);
                    let moodID = event.target.parentNode.parentNode.parentNode.id;

                    TabService.removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID);
                })
            }
            
            lastAccessed.innerHTML = timeSince(new Date(this.lastAccessed));

            this.target.appendChild(img);
            this.target.appendChild(link);
            this.target.appendChild(lastAccessed);
        }
        

        //el.innerHTML=`<img src="${this.favicon}"><a href="${this.url}">${this.title}</a><small>last:${this.lastAccessed}</small>`
        return this.target;
    }

    update(tab,context){
        if(context == undefined)
            context = "";
        
        this.url = tab.url;
        this.title = tab.title;
        this.favicon = (tab.favicon != undefined)?tab.favicon : tab.favIconUrl;
        this.lastAccessed = 
            (tab.lastAccessed != undefined)? tab.lastAccessed : Date.now();
        this.target.innerHTML = "";
        this.render(context);
    }

    tokenForDeletion(){
        this.target.className += "deleted";
    }

    static getTabsFromArray(tabArray,groupID){
        if (tabArray == null) {
            return null;
        }
        let elements = new Array();
        let index = 0;
        tabArray.forEach(element => {
            if(element != null){
                element.id = index;
                let tab = new Tab(element);
                tab.groupId = groupID;
                elements.push(tab);
                index++;
            }
        });
        return elements;
    }

    static isElementInTarget(DOMelement,skip){
        let moodsList = Object.keys(TabService.loadedTabs).concat(["current"]);
        if(skip == undefined)
            skip = 0;
        for (let iteration = 0; iteration < 4; iteration++) {
            if (iteration >= skip && 
                ((moodsList.indexOf(DOMelement.id) != -1 && DOMelement.nodeName == "DIV") || 
                 DOMelement.className.indexOf("btn-tabGroup") > -1)) {
                return true;
            }else {
                if(DOMelement.parentElement == null ||
                   DOMelement.parentElement.nodeName == "BODY"||
                   ["H2","P"].indexOf(DOMelement.nodeName) > -1
                   ){
                    return false;
                }else{
                    DOMelement = DOMelement.parentElement;
                }
            }
            
        }
        return false;
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

    getIdentifier(){
        return this.id + "" + this.groupId + "" + this.lastAccessed;
    }

    compareTo(tab){
        let identifier1 = this.getIdentifier();
        let identifier2 = tab.getIdentifier();
       // console.log(identifier1,identifier2,identifier1 == identifier2)
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

class TabRegistry{
    constructor(){
        this.array = new Array();
    }

    get(id,wid){

    }

    add(id,wid){

    }

    drop(id,wid){

    }
}