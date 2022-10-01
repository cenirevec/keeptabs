export class TabService{

    currentTabs = []

    constructor(){
        //Set the handlers in order to know when the tab list is refreshed
        
        //Add listeners to handle the tabs changes
       /*  Browser.tabs.onActivated.addListener(this.getCurrentTabs);
        Browser.tabs.onRemoved.addListener(this.getCurrentTabs); */
    }

    getCurrentTabs(){
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
/*         let ReadTabs = function(tabs){//console.log("ReadTab(tabs)=>tabs",tabs)
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
            }); 

            //TabService.renderCurrentTabs();
            callback(objectToArray(TabService.current,(tabId,tab)=>{
                return tab.id == tabId;
            }));
        }
        // Get the open tabs
        Browser.tabs.query({currentWindow: true, active: false},ReadTabs);   */     
    }

    saveCurrentTabs(category){

    }

    addTabs(tabArray,category){

    }

    deleteTabs(tabArray){

    }
}

export default TabService;