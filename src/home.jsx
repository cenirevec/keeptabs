import React from "react";
import { createRoot } from "react-dom/client";
import { HeaderPanel } from "./components/panel/header.jsx";
import { CurrentTabsPanel } from "./components/panel/currentTabs/currentTabs.jsx";
import { SavedTabsPanel } from "./components/panel/savedTabs/savedTabs.jsx";
import { FooterPanel } from "./components/panel/footer.jsx";
import { SearchBarPanel } from "./components/panel/searchBar/searchBar.jsx";
import { searchParameters } from "./models/searchFilter.model"
import DataService from "../public/api/services/data/data.service.mjs";
import { Services } from "./services.jsx";
import './home.css';
import { Settings } from "./settings/Settings.jsx";

import "./i18n.js";
import { withTranslation } from 'react-i18next';
import { useTranslation } from "react-i18next";
import i18n from "./i18n.js";


function getObjectDiff(original, current) {
  const changes = {};

  // Check current object's properties
  for (const [key, value] of Object.entries(current)) {
    if (!(key in original)) {
      changes[key] = {
        oldValue: undefined,
        newValue: value
      };
      continue;
    }

    const originalValue = original[key];
    const currentValue = value;

    // Handle different types of comparisons
    if (
      originalValue !== currentValue &&
      String(originalValue) !== String(currentValue) &&
      JSON.stringify(originalValue) !== JSON.stringify(currentValue)
    ) {
      changes[key] = {
        oldValue: originalValue,
        newValue: currentValue
      };
    }
  }

  // Check for removed properties
  for (const key of Object.keys(original)) {
    if (!(key in current)) {
      changes[key] = {
        oldValue: original[key],
        newValue: undefined
      };
    }
  }

  return Object.keys(changes).length === 0 ? null : changes;
}



class Home extends React.Component {

    //Shared Variables
    /** Parameters in the searchbar */
    searchFilter = new searchParameters();
    /** All the tabs arborescence */
    data = DataService.model;
    /** Identifier of a KeepTabs instance */
    instanceId = undefined;
    /** Selected category index */
    category = 0;


    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props);

        // Come back to last visited category
        this.category = parseInt(localStorage.selectedCategory) ?? 0;

        this.state = {
            data: {},
            category: this.category
        };
        this.setMoods = this.setMoods.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.setSelectedCategory = this.setSelectedCategory.bind(this);
        this.saveData = this.saveData.bind(this);
        this.getMap = this.getMap.bind(this);
        this.reload = this.reload.bind(this);
        this.reloadOtherInstances = this.reloadOtherInstances.bind(this);
        this.watch = this.watch.bind(this);

        Services.main = this;

        Services.data.load(() => {
            this.setMoods(Services.data.model);
            setTimeout(() => { this.setSelectedCategory(this.category); }, 0);
            this.forceUpdate();
        });

        //this.scheduler = window.setInterval(this.watch,100);

        // Refresh the window when the user come to it again
        document.addEventListener("focus", this.reload);
    }

    /** Just before update */
    shouldComponentUpdate(nextProps, nextStates) {
        return !(this.props.data == nextProps.data &&
             this.state.category == nextStates.category)
    }


    watch(){
        console.log("In watch");
    }

    //Shared Methods
    setMoods(loadedTabs) {
        if (loadedTabs) {
            this.setState({
                data: loadedTabs
            });

            this.data = loadedTabs;
        }

        if (this.state.selectedCategory == null) {
            this.setState({
                selectedCategory: loadedTabs.categories[0],
                category: 0
            });
        }
    }


    /**
     * @deprecated
     */
    saveData() {
        if (Services.data.model) {
            console.log("goes there")
            Services.data.save(() => {
                this.setMoods(Services.data.model);
                this.refresh();
            })
        }
    }

    /**
     * Set to a selected category
     * @param {*} index 
     */
    setSelectedCategory(index) {
        index = parseInt(index);
        this.category = index;
        let category = this.data.categories[index];
        //console.log(index,category);
        this.setState({
            //selectedCategory: category,
            category: index
        });
        localStorage.selectedCategory = index;
    }

    /**
     * Set search bar filter
     * @param filter Updated filter
     */
    setFilter(filter) {
        this.searchFilter.values = filter.values;
        //Refresh this component
        this.forceUpdate();
    }

    /**
     * 
     * Refresh the component
     */
    refresh() {
        console.debug("home.refresh()");
        this.forceUpdate();
    }

    /***
     * Reload data and refresh
     */
    reload() {
        Services.data.load(() => {
            this.setMoods(Services.data.model);
            setTimeout(() => { this.setSelectedCategory(this.category); }, 0);
        });
        console.debug("home.reload()");
        this.forceUpdate();
    }

    /**
     * Reload other instances 
     * @returns 
     */
    reloadOtherInstances() {
        return Services.background.reloadOtherInstances();
    }


    //Private Methods

    /**
     * Acknowledge the back-end 
     * @returns Tab identifer
     */
    acknowledge() {
        return Services.background.acknowledge();
    }

    /**
 * Acknowledge the back-end 
 * @returns Tab identifer
 */
    getMap() {
        return Services.background.getMap();
    }

    /**
     * React rendering functions
     * @returns Rendered content
     */
    render() {
        if(!this.state.data?.categories) return;
        //console.warn("Render all")
        let theme = window.matchMedia('(prefers-color-scheme: dark)').matches? "dark": "light";
        return (
            <div data-bs-theme={theme} className="container">
                <HeaderPanel />
                <CurrentTabsPanel
                    filter={this.searchFilter}
                    data={this.state.data}
                    selectedCategory={this.state.data.categories[this.state.category]}
                    saveData={this.saveData} />

                <SearchBarPanel
                    filter={this.searchFilter}
                    onFilter={this.setFilter}
                />

                <SavedTabsPanel
                    filter={this.searchFilter}
                    data={this.data}
                    saveData={this.saveData}
                    setSelectedCategory={this.setSelectedCategory}
                    selected={this.state.category}
                    setMoods={this.setMoods} />
                <FooterPanel />
            </div>
        )
    }
}

const THome = withTranslation()(Home);

const root = createRoot(document.getElementById("react-target"));
root.render(<THome i18n={i18n} />);

/**
 * Function to handle the signals from the web pages
 * @param {*} message Data sent to the back-end
 * @param {*} sender Data to identifier the sender
 * @param {*} sendResponse Callback response to give
 */
function handleContentScriptMessage(message, sender, sendResponse) {
    if (message.dst !== "all_instances" &&
        (Services.background.instanceId != undefined && message.dst != Services.background.instanceId))
        return;

    switch (message.actionId) {
        case "acknowledge":
            Services.main.acknowledge().then(console.log);
            break;
        case "reload":
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



/** 0.6.5
 * 
 * Distinguish dev from prod versions by using npm
 */

/*0.7.0 */
/**
 * Add the What's new page
 * Integrate the keywords
 */

/* 0.8.1 */
/*
* Blobify the img URLs and reference to it
*/

/**
 * 
 */