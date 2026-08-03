import { Services } from "../../../../src/services.jsx";
import { LoadingMode } from "../../defaultData.mjs";


export class TabService {

    currentTabs = [];

    constructor() {
        //Set the handlers in order to know when the tab list is refreshed

        //Add listeners to handle the tabs changes
        /*  Browser.tabs.onActivated.addListener(this.getCurrentTabs);
         Browser.tabs.onRemoved.addListener(this.getCurrentTabs); */
         //this.filter = this.filter.bind(this);
         //this.openTabGroup = this.openTabGroup.bind(this);
    }

    getCurrentTabs() {
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

    /**
     * Filter the tab list according to searchbar parameters
     * @param {searchBarParameters} params Searchbar filters
     * @returns 
     */
    static filter(source,params) {
        let filteredTabs = [];

        if (source != undefined) {
            filteredTabs = source.filter(
                tab => params.filter(tab));
        }
        return filteredTabs;
    }

    static openTabGroupById(id,filter,onRefresh){
        let tabGroup;
    }

    static openTabGroup(tabs,filter,onRefresh,onGroupDelete) {
        //let filter; //Get filter from searchbar entries
        let filteredTabs = TabService.filter(tabs,filter);
        let tokenForDeletion = [];

        //Lock window closure
        let preventClose = () => {
            let sanite = confirm("Tabs are openning...")
            return sanite;
        }

        window.onbeforeunload = preventClose;

        let loadingType = Services.data.getSetting("loading.mode");
        let lastIsActive = Services.data.getSetting("loading.makeOpenedTabActive")

        let timeStamp;

        filteredTabs.forEach((tab, index) => {
            //Open all the tab in lazyMode
            if (loadingType == LoadingMode.LAZY) {
                Browser.tabs.create({ url: tab.url, discarded: true, active: lastIsActive });
            }

            //Prepare for deletion
            tokenForDeletion.push(tabs.findIndex(tabInGroup => tabInGroup == tab));
        });

        if (loadingType == LoadingMode.DIFFERED) {
            timeStamp = Date.now();
            let interval = Services.data.getSetting("loading.interval");

            let openNext = (index) => {
                // Load the next tab
                let loadNext = (result) => {
                    index += 1;
                    if (index < filteredTabs.length) {
                        setTimeout(() => {
                            openNext(index)
                        }
                            , interval)
                    } else {
                        //Unlock the window closure
                        window.onbeforeunload = undefined;
                    }
                };
                //Open the tab in case of error or not
                let openTab = (windowId) => {
                    let options = { url: filteredTabs[index].url, active: lastIsActive };
                    if (windowId != undefined) {
                        options.windowId = windowId;
                    }
                    browser.tabs.create(options).then(loadNext, loadNext);
                }

                //Create tabs where the user started the open all feature when possible
                browser.tabs.getCurrent().then((current) => {
                    //Open the tab
                    openTab(current.windowId);
                }, (error) => {
                    //Open the tab
                    openTab();
                    let errorMessage = "Cannot get the current window id, will open when the user has currently the focus";
                    // When an error occurs
                    console.error(errorMessage);

                    //Send the error to the extension logs
                    Services.background.catch(error);
                });
            };

            openNext(0);
        }

        //Remove openned tabs
        tabs = tabs.filter(
            (tab, index) => tokenForDeletion.indexOf(index) == -1);
        if(onRefresh) onRefresh(tabs);

        //Delete the tabgroup if all tabs have been openned and/or deleted
        if (tabs.length == 0) {
            if(onGroupDelete) onGroupDelete();
        }

        //Save the modification
        Services.data.save();
    }

    saveCurrentTabs(category) {

    }

    addTabs(tabArray, category) {

    }

    deleteTabs(tabArray) {

    }
}

export default TabService;