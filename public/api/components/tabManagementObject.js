import { Tab } from "../components/tab.component.mjs";

export default class TabManagementObject{
 
    constructor(){
        this.render = this.render.bind(this);
        this.loadedTabs = new Object();
        this.moods = ["main"];
        this.secretMoods = [];

        this.loadMoods = this.loadMoods.bind(this);
        this.current = [];
    }
  
    /** Save the current tabs */
    async saveCurrentTabs(moodID){
        moodID = (moodID == undefined)? "main": moodID;
        //Define function content
        let save = function(tabList){
            if(!tab.loadedTabs.hasOwnProperty(moodID)){
                tab.loadedTabs[moodID] = new Array();
                tab.moods.push(moodID);
                tab.saveMoods();
            }
                
            tab.loadedTabs[moodID].unshift(tabList);

            //Save the JSON
            data.save(tab.loadedTabs);
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
        browser.tabs.query({currentWindow: true, active: false},ReadTabs);      
    }

    renderTabs(tabs){
        let tabList = new Array();
        for (let i = 0; i < tabs.length; i++) {
            tabList.push(new Tab(tabs[i]));
        }
        return tabList;
    }

    getCurrentlyOpenTabs(tabs){
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(new Tab(tabs[i]));
            }
            //Callback
            vue.currentTabs = tabList[0].url;
            console.log(tabList)
        }
        // Get the open tabs
        browser.tabs.query({currentWindow: true, active: false},ReadTabs);       
    }

    /** Change the saved tabs */
    changeTabs(moodID,tabList){

    }

    /** Load the tabs */
    loadTabsFromJSON(moodID){
        moodID = (moodID == undefined)? "main": moodID;

        data.load(moodID,this.render);
    }

    /** Save the moods */
    saveMoods(){
        data.save({"_init":JSON.stringify(this.moods)});
    }
    /** Load the moods */
    loadMoods(array){
        console.log(array);
        
        if (array == null) {
            data.save({"_init":JSON.stringify(this.moods)});
        } else {
            this.moods = JSON.parse(array._init);

            for(let mood of this.moods){
                this.loadTabsFromJSON(mood);
            }
        }
    }
    
    render(json){
        //Parsing the content
        let key = Object.keys(json)[0];

        //Saving loaded tabs
        this.loadedTabs[key] = json[key];
    }
}
