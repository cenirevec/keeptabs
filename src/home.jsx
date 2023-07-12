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

class Home extends React.Component{
    
    //Shared Variables
    /** Parameters in the searchbar */
    searchFilter = new searchParameters();
    /** All the tabs arborescence */
    data = DataService.model;


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
        /* this.services.data.save(() => {}); */

        Services.main = this;

        Services.data.load(()=>{
            //console.log(this.services.data)
           /*  CategoryService.rename(DataService.model.categories["1"],"Test"); */
           this.setMoods(Services.data.model);
          
            setTimeout(()=>{this.setSelectedCategory(0);},0)
        });
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