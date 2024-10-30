import React from "react";
import { createRoot } from "react-dom/client";
import { HeaderPanel } from "./components/panel/header.jsx";
import { CurrentTabsPanel } from "./components/panel/currentTabs.jsx";
import { SavedTabsPanel } from "./components/panel/savedTabs.jsx";
import { FooterPanel } from "./components/panel/footer.jsx";
import { SearchBarPanel } from "./components/panel/searchBar.jsx";
import { searchParameters } from "./models/searchFilter.model"
import DataService from "../public/api/services/data/data.service.mjs";
import { Services } from "./services.jsx";
import { Browser } from "../public/api/shared.variables.mjs";


class Home extends React.Component{
    
    //Shared Variables
    /** Parameters in the searchbar */
    searchFilter = new searchParameters();
    /** All the tabs arborescence */
    data = DataService.model;
    /** Identifier of a KeepTabs instance */
    instanceId = undefined;


    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);

        this.state = {
            data: {},
            selectedCategory: null
        };
        this.setMoods = this.setMoods.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.setSelectedCategory = this.setSelectedCategory.bind(this);
        this.saveData = this.saveData.bind(this);
        this.ping = this.subscribe.bind(this);
        this.getMap = this.getMap.bind(this);
        this.reload = this.reload.bind(this);
        this.reloadOtherInstances = this.reloadOtherInstances.bind(this);
        

        // Test the background script
        this.subscribe().then(value=>console.log(`your id is ${value}`,this.instanceId))

        Services.main = this;

        Services.data.load(()=>{
            this.setMoods(Services.data.model);
            setTimeout(()=>{this.setSelectedCategory(0);},0)
        });

        // Refresh the window when the user come to it again
        document.addEventListener("focus",this.reload);
    }

    //Shared Methods
    setMoods(loadedTabs){
        if(loadedTabs){
            this.setState({
                data:loadedTabs
            });
            
            this.data = loadedTabs;
        }

        if(this.state.selectedCategory == null){
            this.setState({
                selectedCategory:  loadedTabs.categories[0]
            });
        }
    }


    /**
     * @deprecated
     */
    saveData(){
        if(Services.data.model){
            Services.data.save(()=>{
                this.setMoods(Services.data.model);
                
            })
        }
    }

    setSelectedCategory(index){
        let category = this.data.categories[index];
        this.setState({
            selectedCategory: category
        });
    }

    /**
     * Set search bar filter
     * @param filter Updated filter
     */
    setFilter(filter){
        this.searchFilter.values = filter.values;
        //Refresh this component
        this.forceUpdate();
    }

    /**
     * Refresh the component
     */
    refresh(){
        this.forceUpdate();
    }

    /***
     * Reload data and refresh
     */
    reload(){
        Services.data.load(()=>{
            this.setMoods(Services.data.model);
          
            setTimeout(()=>{this.setSelectedCategory(0);},0)
        });
        this.forceUpdate();
    }

    reloadOtherInstances() {
        return new Promise((resolve, reject) => {
          browser.runtime.sendMessage({
            dst: "server",
            src: Services.main.instanceId,
            actionId: "reload",
            content: null
          }).then((response) => {
            resolve(response);
          }, (error) => {
            onError(error);
            reject(error);
          })
        });
    }


    //Private Methods

    /**
     * Ping the back-end to get the tab identifier
     * @returns Tab identifer
     */
    subscribe() {
        console.log("Subscribing...")
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                dst: "server",
                actionId: "hello",
                content: null
            }).then((response) => {
                this.instanceId = response.identifier;
                resolve(response.identifier);
            }, (error) => {
                onError(error);
                reject(error);
            })
        });
    }

    /**
     * Acknowledge the back-end 
     * @returns Tab identifer
     */
    acknowledge() {
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                dst: "server",
                src: this.instanceId,
                actionId: "acknowledge",
                content: null
            }).then((response) => {
                resolve(response.code);
            }, (error) => {
                onError(error);
                reject(error);
            })
        });
    }

        /**
     * Acknowledge the back-end 
     * @returns Tab identifer
     */
    getMap() {
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                dst: "server",
                src: this.instanceId,
                actionId: "getMap",
                content: null
            }).then((response) => {
                resolve(response);
            }, (error) => {
                onError(error);
                reject(error);
            })
        });
    }

    /**
     * React rendering functions
     * @returns Rendered content
     */
    render(){
        return(
            <div className="container">
                <HeaderPanel />
                <CurrentTabsPanel 
                    filter={this.searchFilter} 
                    data={this.state.data} 
                    selectedCategory={this.state.selectedCategory}
                    saveData={this.saveData}/>
                    
                <SearchBarPanel 
                    filter={this.searchFilter}
                    onFilter={this.setFilter}
                    />
                    
                <SavedTabsPanel 
                    filter={this.searchFilter} 
                    data={this.data}
                    saveData={this.saveData}
                    setSelectedCategory={this.setSelectedCategory}
                    setMoods={this.setMoods}/>
                <FooterPanel />
            </div>
        )
    }
}


const root = createRoot(document.getElementById("react-target"));
root.render(<Home />);

/**
 * Function to handle the signals from the web pages
 * @param {*} message Data sent to the back-end
 * @param {*} sender Data to identifier the sender
 * @param {*} sendResponse Callback response to give
 */
function handleContentScriptMessage(message, sender, sendResponse) {
    //console.debug("Receiving...",message.dst)
    if(message.dst !== "all_instances" && (Services.main.instanceId != undefined && message.dst != Services.main.instanceId)) return;
    //console.debug("Doing...",message.actionId)
    switch (message.actionId) {
        case "acknowledge":
            //console.debug("Acknowleging...")
            Services.main.acknowledge().then(console.log);
            break;
        case "log":
            console.log(message.content)
            break;
        case "reload":
            //console.log("Reloading...")
            Services.main.reload()
            break;
    }
}

browser.runtime.onMessage.addListener(handleContentScriptMessage);

/*
Debug features to develop:
* OK - Add a get uid button
* Rename the fn with a subscribe fn and a ping fn to just say that alive or make one doing both
* Notify an update of the stored data
* Refresh all other instances when an update occurs
* Have an instances map and know when each of them last updated
    * Add a log map button
* Update the instance data instead of a refresh

*/
/*
Features to develop 2
* Create a reference map
* reference the icon
* Shorten the files
* Reduce the number of icons in RAM
* Add some default icons such as one for the 
*/



/** 0.5.5
 * 
 * Distinguish dev from prod versions by using npm
 */

/*0.6.0 */
/**
 * Add the What's new page
 * Integrate the keywords
 */

/* 0.5.1 */
/*
* Blobify the img URLs and reference to it
*/

/**
 * 
 */