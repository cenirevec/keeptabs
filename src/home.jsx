import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { HeaderPanel } from "./components/panel/header.jsx";
import { CurrentTabsPanel } from "./components/panel/currentTabs.jsx";
import { SavedTabsPanel } from "./components/panel/savedTabs.jsx";
import { FooterPanel } from "./components/panel/footer.jsx";
import { SearchBarPanel } from "./components/panel/searchBar.jsx";
import { searchBarParameters } from "./models/searchFilter.model"/* 
import { TabService } from "../public/api/services/oldServices/tab.service.mjs"; */
import DataService from "../public/api/services/data/data.service.mjs";
import CategoryService from "../public/api/services/data/category.service.mjs";

class Home extends React.Component{
    
    
    
    
    //Shared Variables
    /** Parameters in the searchbar */
    searchFilter = new searchBarParameters();
    /** All the tabs arborescence */
    moods = {};


    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);

        this.state = {
            moods: {}
        };
        this.setMoods = this.setMoods.bind(this);
        this.setFilter = this.setFilter.bind(this);

        
        //document.body.addEventListener("dblclick",()=>{console.log("moods",this.moods)});
        //Tests sur les données
        //DataService.save(()=>{DataService.load(console.log)})

        //DataService.load(console.log)
/*         chrome.storage.local.set(DataService.defaultData, (data)=>{
            console.log("set",data);
            chrome.storage.local.get("model",function(json){
                console.log("get",json)
            });
        }); */
        DataService.save(() => {});

        DataService.load(()=>{
            CategoryService.rename(DataService.model.categories["1"],"Test");
        });
    }

    //Shared Methods
    setMoods(loadedTabs){
        this.setState({
            moods:loadedTabs
        });
        this.moods = loadedTabs;
    }
    /**
     * Set search bar filter
     * @param filter Updated filter
     */
    setFilter(filter){
        this.searchFilter.values = filter.values;
        this.forceUpdate();
    }

/*     //TO BE DEFINED
    refreshModel(changes){
        TabService.refresh(changes)
    } */

    //Private Methods

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
                    moods={this.state.moods} 
                    setMoods={this.setMoods}/>
                    
                <SearchBarPanel 
                    filter={this.searchFilter}
                    onFilter={this.setFilter}/>

                <SavedTabsPanel 
                    filter={this.searchFilter} 
                    moods={this.moods} 
                    setMoods={this.setMoods}s/>
                <FooterPanel />
            </div>
        )
    }
}


const root = createRoot(document.getElementById("react-target"));
root.render(<Home />);