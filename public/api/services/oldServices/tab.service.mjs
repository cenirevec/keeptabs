import { DataService } from "../data/data.service.mjs";
import { Browser, objectToArray } from "../../shared.variables.mjs";
import { Tab } from "../../components/tab.component.mjs"
import { timeSince } from "../../shared.variables.mjs";
import { ContextualBar } from "../../components/contextual-bar.component.mjs";
import { TabModel } from "../../../../src/models/tab.model.js";

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

    static contextualBar = new ContextualBar();

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
        TabService.renderSavedTabs.bind(this);


        //Create navbar
        TabService.renderMoodsNavbar(0);
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
    /**
     * Add an array of TabGroups to the save tabs
     * @param {TabGroup[]} tabGroups An array of TabGroup objects
     * @returns False if something went wrong
     */
    static addTabGroups(tabGroups){
        if(tabGroups == null)
            return false;
        
        //Add the tabs to the list
        return true;
    }
    /** Save the current tabs */
    static saveCurrentTabs(moodID,callback){
        moodID = (typeof moodID != "string")? "main": moodID;

        //Define function content
        let save = function (tabGroups,callback){
            if(!TabService.loadedTabs.hasOwnProperty(moodID)){
                TabService.loadedTabs[moodID] = new Array();
                TabService.moods.push(moodID);
                TabService.saveMoods();
            }
            //Add the list of tabs to loaded tabs
            TabService.loadedTabs[moodID].unshift(tabGroups);
            //Save in the local storage
            DataService.save(TabService.loadedTabs,()=>{
                TabService.closeAllTabs();
                
                if(callback != undefined)
                    callback(TabService.loadedTabs);
            });

        }
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(new Tab(tabs[i]));
            }
            //Callback
            save(tabList,callback);
        }
        // Get the open tabs
        Browser.tabs.query({currentWindow: true, active: false},ReadTabs);
    }

    /**
     * Save tabs in a mood
     * @param {string} moodID Name of the category
     * @param {Array<Array<TabModel>>} tabGroups Group of tabs to save in mood
     * @param {Function} callback Function to trigger when saved
     */
    static saveTabs(moodID,tabGroups,callback){
        if(!TabService.loadedTabs.hasOwnProperty(moodID)){
            TabService.loadedTabs[moodID] = new Array();
            TabService.moods.push(moodID);
            TabService.saveMoods();
        }
        if(callback == undefined)
            callback = ()=>{};
        //Add the list of tabs to loaded tabs
        if(tabGroups != undefined)
        TabService.loadedTabs[moodID].unshift(tabGroups);
        //Save in the local storage
        DataService.save(TabService.loadedTabs,callback);
    }

    // Get the tabs currently open and write it in TabService.current
    static getCurrentlyOpenTabs(callback){
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){//console.log("ReadTab(tabs)=>tabs",tabs)
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(""+tabs[i].id);

                if (TabService.current[tabs[i].id] == undefined) {
                    TabService.current[tabs[i].id] = new Tab(tabs[i]);
                } else {
                    //console.log("Trying to update",tabs)
                    TabService.current[tabs[i].id].update(tabs[i],"current");
                }
            }
            //Remove the tabs that are already closed
            /* let toDeleteIDs = Object.keys(TabService.current).filter(
                x => !tabList.includes(x));

            toDeleteIDs.forEach(id=>{
                TabService.current[id].tokenForDeletion();
            }); */

            //TabService.renderCurrentTabs();
            callback(objectToArray(TabService.current,(tabId,tab)=>{
                return tab.id == tabId;
            }));
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
    static fetchTabsFromStorage(moodID,callback){
        if(typeof moodID != 'string')
            return false;
        moodID = (moodID == undefined)? "main": moodID;

        DataService.load(moodID,(tabsDTO)=>{TabService.loadTabsFromJSON(tabsDTO,callback)});
    }

     /**
      * Write loaded tabs in the TabService.loadedTabs variable 
      * @param {Array<TabModel>} json Tab groups as saved in local storage
      * @param {Function} callback Function to run when finished
      */
    static loadTabsFromJSON(json,callback){
        //@Depreacted call KeepTabs parser
        if (json != null) {
            let moodID = Object.keys(json)[0];

            TabService.loadedTabs[moodID] = json[moodID];
            callback(moodID,TabService.loadedTabs[moodID]);
        } 
    }

    // Saving the tabs in data storage
    static saveTabsInStorage(moodID){
        DataService.save(TabService.loadedTabs);
    }
    // Delete the tabs saved in the data storage
    static removeAllTabsFromStorage(){
        TabService.loadedTabs = new Object();
        TabService.moods = ["main"];

        TabService.loadMoods();
       // TabService.renderSavedTabs();

        DataService.clear(TabService.moods,()=>{});
    }

    /** Move the saved tabs */
    static moveTabs(moodID,tabList){

    }

    /** INTERACT WITH THE DOM ELEMENTS */
    // Remove an element from TabService.loadedTabs based on moodID, tabGroupID
    // and tabID, then render it and then save it in browser's data storage
    static removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID){
        //console.log(TabService.loadedTabs,moodID,tabGroupID,tabID)
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
    static OpenAllTabsByGroupID(tabs){
        //Load all tabs
        tabs.forEach(tab=>{
            TabService.openTab(tab);
        });
    }


    /** INTERACTIONS FROM DOM TO TABSERVICE */
    static getTabByLiElement(DOMelement){
        let pos = this.getTabIndexesByLiElement(DOMelement);
        if(pos == null)
            return null;
            
        if(pos.moodID == "current"){
            return TabService.current[pos.tabID];
        }else{
            return TabService.loadedTabs[pos.moodID][pos.groupID][pos.tabID];
        }
    }

    /**
     * Get the group, mood and index of a tab according to a <li> element
     * @param {DOMElement} DOMelement The Li tag element to
     * @returns Tab indexes such as mood, group and tab ids
     */
    static getTabIndexesByLiElement(DOMelement){
        if(DOMelement.nodeName != "LI")
            return null;

        let key = DOMelement.key;
        let groupID = DOMelement.parentElement.id.split('gid')[1];
        let moodID = DOMelement.parentElement.parentElement.id;

        return {moodID:`${moodID}`,groupID:`${groupID}`,tabID:`${key}`};
    }

    /** SELECTION */
    /**
     * Unselect all tabs and render it
     */
    static unselectAllTabs(){
        this.mode.selectedTabs = 0;
        this.mode.selection = false;
        this.render();
    }
    
    /** INTERACT WITH THE MOODS */
    /** Save the moods */
    static saveMoods(){
        DataService.save({"_init":JSON.stringify(TabService.moods)},console.info);
    }
    /** Load the moods */
    static loadMoods(array,callback){
        if (array == null) {
            DataService.save({"_init":JSON.stringify(TabService.moods)},callback);
        } else {
            TabService.moods = JSON.parse(array._init);

            for(let mood of TabService.moods){
                TabService.fetchTabsFromStorage(mood,callback);
            }
        }
    }

    /**
     * Create a new mood tab
     * @param {*} string 
     */
    static createMood(string){
        TabService.moods.push(string);
        TabService.loadedTabs[string] = [];

        TabService.renderMoodsNavbar();
    }

    /**
     * Render the mood's navbar
     * @param {number} selectedMood ID of the mood to select
     */
    static renderMoodsNavbar(selectedMood){
        function renderTab(tabName){
            let tabLink = document.createElement("a");
            tabLink.classList = ["nav-link"];
            tabLink.innerHTML = tabName

            let tabItem = document.createElement("li");
            tabItem.className = "nav-item";
            tabItem.appendChild(tabLink);

            return tabItem;
        }

        //Get the point to place the tabs
        let navbar = document.querySelector(".nav.nav-pills");
        navbar.innerHTML = "";

        console.log(Object.keys(TabService.loadedTabs),TabService,TabService.loadedTabs);
        //Render the tabs
        Object.keys(TabService.loadedTabs).forEach((moodName,index)=>{
            console.log(moodName)
            let tab = renderTab(moodName);

            if(index == selectedMood)
            tab.querySelector(".nav-link").classList.push("active");

            navbar.appendChild(tab);
        })
        /**<li class="nav-item">
                      <a class="nav-link active" aria-current="page">Main</a>
                    </li> */
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

        TabService.renderMoodsNavbar(0);
        
        
        for (const moodID  in TabService.loadedTabs) {
            let container = (savedTabsGroup.querySelector(`#${moodID}`) != null) ?
                            savedTabsGroup.querySelector(`#${moodID}`) :
                            document.createElement("div");
            container.id = moodID;

            container.innerHTML = "";
            container.className = `group-by-moodID`;
            
            let sectiontitle = document.createElement("h2");
            sectiontitle.innerHTML = moodID;
            container.appendChild(sectiontitle);

            let tabsCount = document.createElement("span");
            tabsCount.classList = "tabs-count";

            let moodTabsCount = this.getNumberOfTabs(moodID);
            tabsCount.innerHTML = `<span class="badge rounded-pill bg-primary">${moodTabsCount}</span>`;
            tabsCount.title = `${moodTabsCount} tabs are saved in this mood`
            sectiontitle.appendChild(tabsCount);
 
            let gridContainer = document.createElement("div");
            gridContainer.className = "row"

            let ulID = 0;
            
            for (let index = 0; index < TabService.loadedTabs[moodID].length; index++) {
                const array = TabService.loadedTabs[moodID][index];
                
                if (array == null || array.length == 0) {
                    //Remove the element and skip
                    TabService.loadedTabs[moodID].splice(index,1);
                    index--;
                } else {

                    //Creating a container
                    let tabGroupContainer = document.createElement("div");
                    tabGroupContainer.id = `gid${ulID}`;
                    tabGroupContainer.className = "tab-group-container tabs col-lg-6";

                    //Generating the tab list
                    let list = (container.querySelector(`#gid${ulID}`) != null)?
                                container.querySelector(`#gid${ulID}`):
                                document.createElement("ul");
                    list.id = `gid${ulID}`;
                    list.className = "list-group";

                    //
                    let description = document.createElement("p");
                    description.className = "time-ago";
                                        
                    let date = new Date(array[0].lastAccessed);
                    
                    description.innerHTML = timeSince(date) + " ago";

                    let tabsCount = document.createElement("span");
                    tabsCount.classList = "tabs-count";
                    tabsCount.innerHTML = `<span class="badge rounded-pill bg-secondary">${array.length}</span> tabs`;
                    description.appendChild(tabsCount); 

                    tabGroupContainer.appendChild(description)
                    
                    let numberOfLiToRender = 0;
                    //Add the li elements
                    array.forEach(el =>{
                        let toRender = el.target;
                        if (toRender != null) {
                            list.appendChild(toRender);
                            numberOfLiToRender++; 
                        }
                        el.render();
                        if(el.isHidden) 
                            numberOfLiToRender--;

                    })

                    if (numberOfLiToRender <= 0) {
                        //Do nothing if nothing is shown
                    } else {
                        let loadAllbttn = document.createElement("button");
                        loadAllbttn.className = "btn btn-primary";
                        loadAllbttn.className += " btn-tabGroup";
                        loadAllbttn.addEventListener("click",(event)=>{
                            let moodID = event.target.parentNode.parentNode.parentNode.id;
                            let groupID =  event.target.parentNode.id.split("gid")[1];
                            TabService.OpenAllTabsByGroupID(moodID,groupID)
                        });
                        loadAllbttn.innerHTML = "Open all";
                        
                       
                        tabGroupContainer.appendChild(list);
                        tabGroupContainer.appendChild(loadAllbttn);
                        
                        gridContainer.appendChild(tabGroupContainer);
                    }
                    ulID++;


                }
                
            }

            // Apply sortable script to the selected area in order 
            // to move the tab groups
            Sortable.create(gridContainer, {
                animation: 150,
                ghostClass: 'blue-background-class',  
                onSort: function(){
                    console.log("moved !!!");
                  }
            });

            container.appendChild(gridContainer);
            savedTabsGroup.appendChild(container);
        }
    }

    /**
     * Get the number of tabs by mood ID
     * @param {*} moodID (optional) ID of the mood to check
     * @returns the number of tabs in the given mood
     */
    static getNumberOfTabs(moodID){
        let count = 0;
        TabService.loadedTabs[moodID].forEach((tabGroup)=>{
            count += tabGroup.length;
        })
        return count;
    }

    /**
     * Show or hide selected footer menu
     * @param {*} variation 
     */
    static changeNumberOfSelectedTabs(variation){
        this.mode.selectedTabs += variation;
        
        if(this.mode.selectedTabs <= 0){
            this.mode.selection = false;
            this.contextualBar.selectMode("hidden");
        }else{
            this.mode.selection = true;
            this.contextualBar.selectMode("selection");
        }
        this.render();
    }

    /**
     * Store all the tabs in a JSON file and download it
     */
    static download() {
        //console.log(TabService.loadedTabs)
        var data = JSON.stringify(TabService.loadedTabs);
        var a = document.createElement("a");
        var file = new Blob([data], {type: 'application/json'});
        a.href = URL.createObjectURL(file);

        function addLeadingZeros(n) {
            if (n <= 9) {
              return "0" + n;
            }
            return n
          }

        let currentDatetime = new Date()
        //console.log(currentDatetime.toString());
        let formattedDate = currentDatetime.getFullYear() + "-" + addLeadingZeros(currentDatetime.getMonth() + 1) + "-" + addLeadingZeros(currentDatetime.getDate()) + " " + addLeadingZeros(currentDatetime.getHours()) + ":" + addLeadingZeros(currentDatetime.getMinutes()) + ":" + addLeadingZeros(currentDatetime.getSeconds())
        //console.log(formattedDate);

        a.download = `keeptabs-data_${formattedDate}.json`;
        a.click();
    }
    
    /** New methods */
    // 
    static openTab(tab,options){ 
/*         if (this.isHidden || (!this.selected && TabService.mode.selection)) {
            return false;
        } else {
            options = (options == undefined || options == null)? {}:options;
            options["url"] = this.url;

            Browser.tabs.create(options);
            return true;
        } */
        if (1==2) {
            return false;
        } else {
            options = (options == undefined || options == null)? {}:options;
            options["url"] = tab.url;

            Browser.tabs.create(options);
            return true;
        }
    }
}