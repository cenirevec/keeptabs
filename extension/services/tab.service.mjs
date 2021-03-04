import { DataService } from "./data.service.mjs";
import { Browser } from "../components/shared.variables.mjs";
import { Tab } from "../components/tab.component.mjs"
import { timeSince } from "../components/shared.variables.mjs";

export class TabService{
    // The tabs open or saved
    static current = new Object();
    static loadedTabs = new Object();
    //The categories
    static moods = ["main"];
    static secretMoods = []; //Hidden categories, not implemented yet

    static once = true;

    static mode = {
        selection: false,
        selectedTabs: 0
    };

    //Buttons to load into the DOM
    static buttons = {
        save: null,
        saveIn: null
    }

    constructor(){
        this.onInit();
    }

    /** Functions to launch to initialize the object and the DOM elements */
    onInit(){
        //Get and display the currently open tabs
        TabService.getCurrentlyOpenTabs();

        //Add listeners to handle the tabs changes
        Browser.tabs.onActivated.addListener(TabService.getCurrentlyOpenTabs);
        Browser.tabs.onRemoved.addListener(TabService.onRemovedTab);

        //Set the buttons
        TabService.buttons.save = document.getElementById("saveCurrent");
        TabService.buttons.save.addEventListener("click",TabService.saveCurrentTabs);

        TabService.buttons.saveIn = document.getElementById("saveCurrentIn");
    }

    /**Event listeners */
    // Action to do when a tab is closed
    static onRemovedTab(tabToRemoveId){
        TabService.renderCurrentTabs();
    }
    //Update the button appearances and behavior according to the TabService state
    static updateButtons(){
        if (!Object.keys(TabService.current).length) {
            TabService.buttons.save.disabled = true;
            TabService.buttons.saveIn.disabled = true;
        }else{
            TabService.buttons.save.removeAttribute("disabled");
            TabService.buttons.saveIn.removeAttribute("disabled");
        }
    }
  
    /** INTERACT WITH TABS */
    /** Save the current tabs */
    static saveCurrentTabs(moodID){
        moodID = (typeof moodID != "string")? "main": moodID;

        //Define function content
        let save = function(tabList){
            if(!TabService.loadedTabs.hasOwnProperty(moodID)){
                TabService.loadedTabs[moodID] = new Array();
                TabService.moods.push(moodID);
                TabService.saveMoods();
            }
            //Add the list of tabs to loaded tabs
            TabService.loadedTabs[moodID].unshift(tabList);
            //Save in the local storage
            DataService.save(TabService.loadedTabs,TabService.closeAllTabs);
            
            TabService.renderSavedTabs();
        }

        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(new Tab(tabs[i]));
            }
            //Callback
            save(tabList);
        }
        // Get the open tabs
        Browser.tabs.query({currentWindow: true, active: false},ReadTabs);
    }
    // Get the tabs currently open and write it in TabService.current
    static getCurrentlyOpenTabs(){
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(""+tabs[i].id);
                if (TabService.current[tabs[i].id] == undefined) {
                    TabService.current[tabs[i].id] = new Tab(tabs[i]);
                } else {
                    TabService.current[tabs[i].id].update(tabs[i],"current");
                }
            }
            //Remove the tabs that are already closed
            let toDeleteIDs = Object.keys(TabService.current).filter(
                x => !tabList.includes(x));

            toDeleteIDs.forEach(id=>{
                TabService.current[id].tokenForDeletion();
            });

            TabService.renderCurrentTabs();
        }
        // Get the open tabs
        Browser.tabs.query({currentWindow: true, active: false},ReadTabs);       
    }
    // Close all the tabs currently opened
    static closeAllTabs(){
        Browser.tabs.remove(Object.keys(TabService.current).map(x=>parseInt(x)),null);
        for (const key in TabService.current) {
            if (Object.hasOwnProperty.call(TabService.current, key)) {
                const tab = TabService.current[key];
                tab.tokenForDeletion();
            }
        }
    }

    /** USING DATA STORAGE */
    /** Load the tabs from data storage */
    static fetchTabsFromStorage(moodID){
        if(typeof moodID != 'string')
            return false;
        moodID = (moodID == undefined)? "main": moodID;

        DataService.load(moodID,TabService.loadTabsFromJSON);
    }
    // Write loaded tabs in the TabService.loadedTabs variable 
    static loadTabsFromJSON(json){
        if (json != null) {
            let moodID = Object.keys(json)[0];
            let tabSetToLoad = new Object();
            tabSetToLoad[moodID] = new Array();
            for (let index = 0; index < json[moodID].length; index++) {
                let tab = Tab.getTabsFromArray(json[moodID][index],index);
                tabSetToLoad[moodID].push(tab);
            }
            TabService.loadedTabs = tabSetToLoad;
        }
        
        TabService.renderSavedTabs();
    }
    // Saving the tabs in data storage
    static saveTabsInStorage(moodID){
        DataService.save(TabService.loadedTabs,console.log);
    }
    // Delete the tabs saved in the data storage
    static removeAllTabsFromStorage(){
        TabService.loadedTabs = new Object();
        TabService.moods = ["main"];

        TabService.loadMoods();
        TabService.renderSavedTabs();

        DataService.clear(TabService.moods,()=>{});
    }

    /** Change the saved tabs */
    static changeTabs(moodID,tabList){

    }

    /** INTERACT WITH THE DOM ELEMENTS */
    // Remove an element from TabService.loadedTabs based on moodID, tabGroupID
    // and tabID, then render it and then save it in browser's data storage
    static removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID){
        let key = Object.keys(TabService.loadedTabs[moodID][tabGroupID])[tabID];
        let tokenForDeletion = TabService.loadedTabs[moodID][tabGroupID].length <= 1;

        TabService.loadedTabs[moodID][tabGroupID].splice(key,1);
        if (tokenForDeletion) {
            TabService.loadedTabs[moodID].splice(tabGroupID,1);
        }

        this.renderSavedTabs();
        this.saveTabsInStorage(moodID);
    }
    // Open all tabs from a group of TabService.loadedTabs based on moodID
    // and tabGroupID, then render it and then save it in browser's data storage
    static OpenAllTabsByGroupID(moodID,groupID){
        //Load all tabs
        for (let index = 0; index < TabService.loadedTabs[moodID][groupID].length; index++) {
            const tab = TabService.loadedTabs[moodID][groupID][index];
           
            if(tab.open()){
                TabService.loadedTabs[moodID][groupID].splice(index,1);
                this.mode.selectedTabs--;
                index--;
            }
        }
        this.changeNumberOfSelectedTabs(0);
        //Remove for TabService.loadedTabs
        if(!TabService.loadedTabs[moodID][groupID].length)
            TabService.loadedTabs[moodID].splice(groupID,1);
        //Render and save
        this.renderSavedTabs();
        this.saveTabsInStorage(moodID);
    }

    /** INTERACTIONS FROM DOM TO TABSERVICE */
    static getTabByLiElement(DOMelement){
        let pos = this.getTabIndexesByLiElement(DOMelement);

        if(pos.moodID == "current"){
            return TabService.current[pos.tabID];
        }else{
            return TabService.loadedTabs[pos.moodID][pos.groupID][pos.tabID];
        }
    }

    static getTabIndexesByLiElement(DOMelement){
        let key = DOMelement.key;
        let groupID = DOMelement.parentElement.id.split('gid')[1];
        let moodID = DOMelement.parentElement.parentElement.id;

        return {moodID:`${moodID}`,groupID:`${groupID}`,tabID:`${key}`};
    }

    /** SELECTION */
    static unselectAllTabs(){
        this.current.forEach(element => {
            element.toggleSelected(false);
        });

        this.loadedTabs.forEach(moods =>{
            moods.forEach(groups=>{
                groups.forEach(tab=>{
                    tab.toggleSelected(false);
                });
            });
        });

        this.mode.selectedTabs = 0;
        this.mode.selection = false;
    }
    
    /** INTERACT WITH THE MOODS */
    /** Save the moods */
    static saveMoods(){
        DataService.save({"_init":JSON.stringify(TabService.moods)},console.log);
    }
    /** Load the moods */
    static loadMoods(array){
        if (array == null) {
            DataService.save({"_init":JSON.stringify(TabService.moods)},TabService.renderSavedTabs);
        } else {
            TabService.moods = JSON.parse(array._init);

            for(let mood of TabService.moods){
                TabService.fetchTabsFromStorage(mood);
            }
        }
    }
    
    /**Render the Tabs in the DOM */
    // Render each part
    static render(){
        //Show current Tabs
        TabService.renderCurrentTabs();
        
        //Show the other tabs
        TabService.renderSavedTabs();
    }
/*
    static renderTabs(tabs){
        let tabList = new Array();
        for (let i = 0; i < tabs.length; i++) {
            tabList.push(new Tab(tabs[i]));
        }
        return tabList;
    }
*/
    //Render the tabs currently open
    static renderCurrentTabs(){
        let currentTabsGroup = document.querySelector("#current .list-group");       

        for (const tabID in TabService.current) {
            let tab = TabService.current[tabID];
            let empty = tab.target.innerHTML == "";
            let toRender = tab.render("current");

            if(empty){ //Check if an element is not added yet
                currentTabsGroup.appendChild(toRender);
            }else if (toRender.className.indexOf("deleted") != -1) {  //Remove an element
                currentTabsGroup.removeChild(toRender);
                delete TabService.current[tab.id];
            } else {//Nothing to do 
            }
        }
        
        TabService.updateButtons();
        let currentTabLength = Object.keys(TabService.current).length;
        document.querySelector("#current h2 .badge").innerHTML = currentTabLength;
        
    }

    // Render the tabs saved in TabService.loadedTabs
    static renderSavedTabs(){
        let savedTabsGroup = document.querySelector("#loaded #wrapper");
        //savedTabsGroup.className = savedTabsGroup.className.split("empty").join("");
        if(this.once)savedTabsGroup.innerHTML = "";
        
        TabService.updateButtons();
        this.once = false;
        if(Object.keys(TabService.loadedTabs).length == 0){
            let savedTabsGroup = document.querySelector("#loaded #wrapper");
            //savedTabsGroup.className += "empty";
            savedTabsGroup.innerHTML = "<h2 class='empty'>Nothing saved yet</h2>";

            return true;
        }
        
        
        for (const moodID  in TabService.loadedTabs) {
            let container = (savedTabsGroup.querySelector(`#${moodID}`) != null) ?
                            savedTabsGroup.querySelector(`#${moodID}`) :
                            document.createElement("div");
            container.id = moodID;

            container.innerHTML = "";
            container.className = `group-by-moodID row`;
            
            let sectiontitle = document.createElement("h2");
            sectiontitle.innerHTML = moodID;
            container.appendChild(sectiontitle);
            let ulID = 0;
            
            for (let index = 0; index < TabService.loadedTabs[moodID].length; index++) {
                const array = TabService.loadedTabs[moodID][index];
                
                if (array == null || array.length == 0) {
                    //Remove the element and skip
                    TabService.loadedTabs[moodID].splice(index,1);
                    index--;
                } else {
                    let list = (container.querySelector(`gid${ulID}`) != null)?
                                container.querySelector(`gid${ulID}`):
                                document.createElement("ul");
                    list.id = `gid${ulID}`;
                    list.className = "list-group tabs col-lg-6";

                    let description = document.createElement("p");
                    description.className = "time-ago";
                    
                    let date = new Date(array[0].lastAccessed);
                    
                    //let timeAgo = timeSince(date);
                    description.innerHTML = timeSince(date) + " ago";
                    list.appendChild(description)
                    
                    let numberOfLiToRender = 0;
                    //Add the li elements
                    array.forEach(el =>{
                        let toRender = el.target;
                        if (toRender != null) {
                            list.appendChild(toRender);
                            numberOfLiToRender++; 
                        }
                        el.render();                        
                    })
                    
                    if (!numberOfLiToRender) {
                        //Do nothing if nothing is shown
                    } else {
                        let loadAllbttn = document.createElement("button");
                        loadAllbttn.className = "btn btn-primary";
                        loadAllbttn.className += " btn-tabGroup";
                        loadAllbttn.addEventListener("click",(event)=>{
                            let moodID = event.target.parentNode.parentNode.id;
                            let groupID =  event.target.parentNode.id.split("gid")[1];
                            TabService.OpenAllTabsByGroupID(moodID,groupID)
                        });
                        loadAllbttn.innerHTML = "Open all";
                        
                        list.appendChild(loadAllbttn);
                        container.appendChild(list);
                        
                    }
                    ulID++;
                    

                }
                
            }
            savedTabsGroup.appendChild(container);
        }
    }

    static changeNumberOfSelectedTabs(variation){
        this.mode.selectedTabs += variation;
        
        if(this.mode.selectedTabs <= 0){
            this.mode.selection = false;
        }else{
            this.mode.selection = true;
        }
        this.render();
    }
}