import { DataService } from "./data.service.mjs";
import { Browser } from "../components/shared.variables.mjs";
import { Tab } from "../components/tab.component.mjs"

export class TabService{
    static loadedTabs = new Object();
    static moods = ["main"];
    static current = new Object();
    static secretMoods = [];
    static test = 0;

    static buttons = {
        save: null,
        saveIn: null
    }

    constructor(){
        this.onInit();
    }

    onInit(){
        //Get and display the currently open tabs
        TabService.getActiveTabs();

        //Add listeners to handle the tabs changes
        Browser.tabs.onActivated.addListener(TabService.getActiveTabs);
        //Browser.tabs.onCreated.addListener(console.log);
        Browser.tabs.onRemoved.addListener(TabService.onRemovedTab);

        //Set the buttons
        TabService.buttons.save = document.getElementById("saveCurrent");
        TabService.buttons.save.addEventListener("click",TabService.saveCurrentTabs);

        TabService.buttons.saveIn = document.getElementById("saveCurrentIn");
    }

    static onRemovedTab(tabToRemoveId){
        delete TabService.current[tabToRemoveId];
        TabService.renderCurrentTabs();
    }

    static updateButtons(){
        if (!Object.keys(TabService.current).length) {
            TabService.buttons.save.disabled = true;
            TabService.buttons.saveIn.disabled = true;
        }else{
            TabService.buttons.save.removeAttribute("disabled");
            TabService.buttons.saveIn.removeAttribute("disabled");
        }
    }
  
    /** Save the current tabs */
    static saveCurrentTabs(moodID){
        moodID = (typeof moodID != "string")? "main": moodID;
        console.log("saving current tabs");

        //Define function content
        let save = function(tabList){
            if(!TabService.loadedTabs.hasOwnProperty(moodID)){
                TabService.loadedTabs[moodID] = new Array();
                TabService.moods.push(moodID);
                TabService.saveMoods();
            }
            //Add the list of tabs to loaded tabs
            TabService.loadedTabs[moodID].unshift(tabList);
            console.log(TabService.loadedTabs)
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

    static renderTabs(tabs){
        let tabList = new Array();
        for (let i = 0; i < tabs.length; i++) {
            tabList.push(new Tab(tabs[i]));
        }
        return tabList;
    }

    static getActiveTabs(){
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){
            let tabList = new Object();
            for (let i = 0; i < tabs.length; i++) {
                tabList[tabs[i].id]= new Tab(tabs[i]);
            }

            //Callback
            TabService.current = tabList;
         //   console.log(tabList);

            TabService.renderCurrentTabs();
        }
        // Get the open tabs
        Browser.tabs.query({currentWindow: true, active: false},ReadTabs);       
    }

    /** Change the saved tabs */
    static changeTabs(moodID,tabList){

    }

    static dropAllTabs(){
        TabService.loadedTabs = new Object();
        TabService.moods = ["main"];

        TabService.loadMoods();
        TabService.renderSavedTabs();

        DataService.clear(TabService.moods,()=>{});
/*
        let savedTabsGroup = document.querySelector("#loaded");
        savedTabsGroup.removeChild(savedTabsGroup.childNodes[0]);*/
    }

    /** Load the tabs */
    static fetchTabs(moodID){
        if(typeof moodID != 'string')
            return false;
        moodID = (moodID == undefined)? "main": moodID;
      //  console.log(moodID);
        DataService.load(moodID,TabService.loadTabs);
    }

    static loadTabs(json){
        if (json != null) {
            let moodID = Object.keys(json)[0];
            let tabSetToLoad = new Object();
            tabSetToLoad[moodID] = new Array();
            for (let index = 0; index < json[moodID].length; index++) {
                let tab = Tab.getTabsFromArray(json[moodID][index]);
                tabSetToLoad[moodID].push(tab);
            }
            TabService.loadedTabs = tabSetToLoad;
        }
        
        TabService.renderSavedTabs();
    }

    static closeAllTabs(){
        Browser.tabs.remove(Object.keys(TabService.current).map(x=>parseInt(x)),null);
    }

    static removeTabFromLoadedTabsByID(moodID,tabGroupID,tabID){
        let key = Object.keys(TabService.loadedTabs[moodID][tabGroupID])[tabID];
        delete TabService.loadedTabs[moodID][tabGroupID][key];
        
        this.renderSavedTabs();
        this.saveTabs(moodID);
    }

    static saveTabs(moodID){
        DataService.save(TabService.loadedTabs,console.log);
    }

    static loadAllTabsByGroupID(moodID,groupID){
        //Load all tabs
        TabService.loadedTabs[moodID][groupID].forEach(tab=>{
            tab.open();
        })

        //Remove for TabService.loadedTabs
        delete TabService.loadedTabs[moodID][groupID];
        //Render and save
        this.renderSavedTabs();
        this.saveTabs(moodID);
    }
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
                TabService.fetchTabs(mood);
            }
        }
    }
    
    static render(){
        //TabService.getActiveTabs();
       // console.log(TabService.loadedTabs);
        //Show current Tabs
        TabService.renderCurrentTabs();
        
        //Show the other tabs
        TabService.renderSavedTabs();
    }

    static renderCurrentTabs(){
        let currentTabsGroup = document.querySelector("#current .list-group");
        currentTabsGroup.innerHTML ="";

        for (const tab in TabService.current) {
            currentTabsGroup.appendChild(TabService.current[tab].render("current"));
        }
        
        TabService.updateButtons();
        let currentTabLength = Object.keys(TabService.current).length;
        document.querySelector("#current h2 .badge").innerHTML = currentTabLength;
    }

    static renderSavedTabs(){
        let savedTabsGroup = document.querySelector("#loaded #wrapper");
      //  savedTabsGroup.removeChild(savedTabsGroup.childNodes[0]);
        savedTabsGroup.innerHTML = "";
        TabService.updateButtons();

        if(Object.keys(TabService.loadedTabs).length == 0){
            let savedTabsGroup = document.querySelector("#loaded #wrapper");
            savedTabsGroup.innerHTML = "<h2>Nothing saved yet</h2>";

            return true;
        }
        
        
        for (const moodID  in TabService.loadedTabs) {
            let container = document.createElement("div");
            container.id = moodID;

            //container = (document.querySelector("#"+moodID));
            container.innerHTML = "";
            container.className = `group-by-moodID row`;
            
            let sectiontitle = document.createElement("h2");
            sectiontitle.innerHTML = moodID;
            container.appendChild(sectiontitle);
            let ulID = 0;

            //savedTabsGroup.appendChild(TabService.current[tab].render("current"));
            TabService.loadedTabs[moodID].forEach(array => {

                if (array == null) {
                    //Skip
                } else {
                    let list = document.createElement("ul");
                    list.id = ulID;
                    list.className = "list-group tabs col-lg-6";

                    let description = document.createElement("p");
                    description.className = "time-ago";
                    description.innerHTML = "3 days ago";
                    list.appendChild(description)
                    
                    
                    //Add the li elements
                    array.forEach(el =>{
                        list.appendChild(el.render());
                    })


                    let loadAllbttn = document.createElement("button");
                    loadAllbttn.className = "btn btn-primary";
                    loadAllbttn.addEventListener("click",(event)=>{
                        let moodID = event.target.parentNode.id;
                        let groupID =  event.target.previousElementSibling.id;
                        TabService.loadAllTabsByGroupID(moodID,groupID)
                    });
                    loadAllbttn.innerHTML = "Open all"
                    
                    list.appendChild(loadAllbttn);
                    container.appendChild(list);
                    ulID++;
                }
                
            });

            savedTabsGroup.appendChild(container);
           // console.log(savedTabsGroup);
        }
        
        //console.log(TabService.loadedTabs);
    }
}