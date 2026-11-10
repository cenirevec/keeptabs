import { Services } from "../../../../src/services.jsx";
import { LoadingMode } from "../../defaultData.mjs";


export class TabService {

    currentTabs = [];

    constructor() {
    }

    /**
     * Filter the tab list according to searchbar parameters
     * @param {searchBarParameters} params Searchbar filters
     * @returns 
     */
    static filter(source, params) {
        let filteredTabs = [];

        if (source != undefined) {
            filteredTabs = source.filter(
                tab => params.filter(tab));
        }
        return filteredTabs;
    }

    /**
     * Open a random tab group within a category
     * @param {*} category Category to pick a tab group from
     * @param {*} filter Filter on the tabs
     */
    static openRandomTabGroup(category, filter) {
        let tabGroupId = Date.now() % category.tabGroups.length;
        let tabGroup = category.tabGroups[tabGroupId];

        //Delete a tabGroup if all tabs are loaded
        let onDelete = () => {
            category.tabGroups.splice(tabGroupId, 1);
            //Save the modification
            Services.data.save();
        };

        //Open the selected tabs
        TabService.openTabGroup(
            tabGroup.tabs,
            filter,
            (tabs) => { tabGroup.tabs = tabs; Services.main?.refresh() },
            onDelete
        )
    }

    /**
     * TO BE DEFINED
     * @param {*} id 
     * @param {*} filter 
     * @param {*} onRefresh 
     */
    static openTabGroupById(id, filter, onRefresh) {
        let tabGroup;
    }

    /**
     * Open a tab group
     * @param {*} tabs Actual tab group
     * @param {*} filter Filter on the tabs
     * @param {*} onRefresh Function to trigger to refesh the view
     * @param {*} onGroupDelete Function to trigger on tab group deletion
     */
    static openTabGroup(tabs, filter, onRefresh, onGroupDelete) {
        //let filter; //Get filter from searchbar entries
        let filteredTabs = TabService.filter(tabs, filter);
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

                    Services.main.setTabsToOpen(filteredTabs.length - index - 1);
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
        if (onRefresh) onRefresh(tabs);

        //Delete the tabgroup if all tabs have been openned and/or deleted
        if (tabs.length == 0) {
            if (onGroupDelete) onGroupDelete();
        }

        //Save the modification
        Services.data.save();
    }

    getCurrentTabs(handler,options){

    }

    saveCurrentTabs(category) {

    }

    addTabs(tabArray, category) {

    }

    deleteTabs(tabArray) {

    }
}

export default TabService;