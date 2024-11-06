import { TabService } from "../services/oldServices/tab.service.mjs";
import { timeSince } from "../shared.variables.mjs";
import { Browser, getClosestParentByClass } from "../shared.variables.mjs";

var rootURL = window.location.href.split("/home.html")[0];

var Imgs = {
    extension : rootURL + "/media/ico-48.png",
    default : rootURL + "/media/ico-48.png"
}

var uniqueId = 0;
/** Tab
 * @constructor
 */
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

    /**
     * Render a tab element
     * @param {*} context Whether it's the current or the saved tabs
     * @returns HTML elements to display
     */
    render(context){
        if (this.isHidden || this.target == null) {
            if(this.target == null){
                return null;
            }else{
                if(this.target.className.indexOf("hidden") == -1){
                    this.target.className += " hidden";
                }
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
        this.target.identifier = this.getIdentifier();

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
                link.innerText = this.title;

            if (!TabService.mode.selection) {
                link.target = "_blank";
                link.onclick = "return false;";
                link.addEventListener("click",event => {
                    let tabID = event.target.parentNode.key;
                    let tabGroupID = parseInt(getClosestParentByClass(event.target,"tab-group-container").id.split('gid')[1]);
                    let moodID = getClosestParentByClass(event.target,"group-by-moodID").id;
                    //console.log(moodID,tabGroupID,tabID)
                    TabService.removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID);
                    //window.focus();
                })
            }
            
            lastAccessed.innerText = timeSince(new Date(this.lastAccessed));

            this.target.appendChild(img);
            this.target.appendChild(link);
            this.target.appendChild(lastAccessed);
        }
        

        //el.innerHTML=`<img src="${this.favicon}"><a href="${this.url}">${this.title}</a><small>last:${this.lastAccessed}</small>`
        return this.target;
    }

    /**
     * Update a tab
     * @param {Tab} tab Tab to copy
     * @param {*} context Rendering context (Whether it's a current or a saved tab)
     */
    update(tab,context){
        if(context == undefined)
            context = "";
        
        this.url = tab.url;
        this.title = tab.title;
        this.favicon = (tab.favicon != undefined)?tab.favicon : tab.favIconUrl;
        //The lastAccessed date is not accurate on chrome
        if(tab.lastAccessed != undefined){
            this.lastAccessed = tab.lastAccessed;
        }
        chrome.tabs.query({
            active: false
          }, (tabs) => {
            let tab = tabs.reduce((previous, current) => {
              return previous.lastAccessed > current.lastAccessed ? previous : current;
            });
            // previous tab
            //console.log(tab);
          });

        this.target.innerHTML = "";
        this.render(context);
    }

    /**
     * Add a token for deletion
     */
    tokenForDeletion(){
        this.target.className += "deleted";
    }

    /**
     * Get an array of tab object based on JSON
     * @param {} tabArray Array of tab JSON
     * @param {number} groupID Id of the group
     * @returns An array of Tab objects
     */
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

    /**
     * Find the mood name of a clicked tab by check tag parent id recursively
     * @param {*} DOMelement The element we clicked on
     * @param {*} skip (optional) 
     * @returns 
     */
    static isElementInTarget(DOMelement,skip){
        //Defines how much a tag can be deeper than the target element
        let maximumTagDepth = 4;
        let moodsList = Object.keys(TabService.loadedTabs).concat(["current"]);

        if(skip == undefined)
            skip = 0;

        //Go deeper and deeper since we be sure of the element we clicked in 
        for (let iteration = 0; iteration < maximumTagDepth; iteration++) {
            if (iteration >= skip && (
                    (moodsList.indexOf(DOMelement.id) != -1 && DOMelement.nodeName == "DIV") 
                    || DOMelement.className.indexOf("btn-tabGroup") > -1
                    )) {
                return true;
            }else {
                if(DOMelement.parentElement == null ||
                   DOMelement.parentElement.nodeName == "BODY"||
                   ["H2","P"].indexOf(DOMelement.nodeName) > -1
                   ){
                    return false;
                }else{
                    DOMelement = DOMelement.parentElement;
                    //Then continue
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

    /**
     * Check if the text matches the regular expression
     * @param {string} regexp Regular expression
     * @returns True if the text matches the regular expression, False otherwise
     */
    match(regexp){
        let text = this.url.concat(" "+this.title);
        
        if(text.search(regexp) > -1){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Display the tab
     * @param {boolean} boolean True if the tab should be displayed, False otherwise
     */
    show(boolean){
        this.isHidden = !boolean;
    }

    /**
     * Select the tab
     * @param {boolean} boolean True if the tab should be selected, False otherwise
     */
    toggleSelected(boolean){
        this.selected = (boolean != undefined)? boolean : !this.selected;

        if (this.selected) {
            TabService.changeNumberOfSelectedTabs(1);
        } else {
            TabService.changeNumberOfSelectedTabs(-1);
        }
    }

    /**
     * Get an unique tab identifier
     * @returns An unique tab identifier
     */
    getIdentifier(){
        return this.id + "" + this.groupId + "" + this.lastAccessed;
    }

    /**
     * Compare this tab to another by their identifiers
     * @param {Tab} tab Tab to compare
     * @returns True if the tab is the same, False otherwise
     */
    compareTo(tab){
        let identifier1 = this.getIdentifier();
        let identifier2 = tab.getIdentifier();

        return identifier1 == identifier2;
    }

    /**
     * Find the index of the tab in an array
     * @param {*} array 
     * @returns The index of the tab
     */
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

/**
 * @deprecated Not in use
 */
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