import React from "react";
import { TabModel } from "../../models/tab.model.js";
import { MoodGroup } from "../element/moodGroup.jsx";
import MoodNavBar from "../element/moodNavBar.jsx";


export class SavedTabsPanel extends React.Component {

    moodLengths = {}
    moods = [];

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props);

        this.state = {
            categories: this.props.data,
            selected: 0,
            forceReload: false
        };

        // Function bindings
        this.getMoods = this.getMoods.bind(this);
        this.updateMood = this.updateMood.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.addMood = this.addMood.bind(this);
        this.saveTabs = this.saveTabs.bind(this);

        // 
        this.getMoods();
    }

    /**
     * Get the list of all categories in the local storage
     */
    getMoods() {
        /*         var callback = (array)=>{
                    TabService.loadMoods(array,this.updateMood);
                }
                callback = callback.bind(this); */

        // Load old elements*
        /* 
        DataService.load(callback); */

        // Get the length of moods
        this.getMoodLengths();
    }

    /**
     * Select a category
     * @param {number} categoryId Id of the category
     */
    selectCategory(categoryId) {
        this.setState({
            selected: categoryId
        });
        this.props.setSelectedCategory(categoryId)
    }

    /**
     * Add a category
     * @param {string} name Name of the category
     * @param {Array<Array<TabModel>>} tabGroups Tabs to add while adding the category
     */
    addMood(name, tabGroups) {
        if (tabGroups) {
            this.updateMood(name, tabGroups);
        } else {
            this.updateMood(name, new Array());
        }
        //Save the category
        this.saveTabs(name, tabGroups);
    }

    /**
     * Set the moods property
     * @param {*} moods Save tabs with their categories
     */
    setMoods() {
        this.props.setMoods(this.props.moods);
    }

    /**
     * Update categories
     * @param {Object} moods Tabs data
     */
    updateMoods(moods) {
        this.setState({
            moods: moods
        });
        this.setMoods();

        this.getMoodLengths();
    }

    /**
     * Update a category
     * @param {string} mood 
     * @param {Object} tabGroups 
     */
    updateMood(mood, tabGroups) {
        /*         let moods = this.props.moods;
                moods[mood] = tabGroups;
                //Empty the array if there are no tabs
                if(moods[mood].length == 1 && moods[mood][0].length == 0)
                    moods[mood].length = 0;
        
                this.setState({
                    moods: moods
                })
                this.setMoods();
                
                //Save the data
        /*         TabService.loadedTabs[mood] = tabGroups;
                TabService.saveTabs(mood); *
        
                this.getMoodLengths(); */
    }

    /**
     * Save tabs in a category
     * @param {string} name Name of the category to save
     * @param {TabModel[][]} tabGroups Tabs to save in the category
     */
    saveTabs(name, tabGroups) {
        /*         if(!tabGroups)
                    tabGroups = [];
                let callback = ()=>{
                    TabService.closeAllTabs();
                    this.getMoods();
                }
        
                TabService.saveTabs(name,tabGroups,callback); */
    }

    /**
     * Get the number of tabs in each category
     */
    getMoodLengths() {
        if (this.props.moods == undefined)
            return;

        this.moodLengths = {};
        Object.keys(this.props.moods).forEach((mood) => {
            this.moodLengths[mood] = 0;
            this.props.moods[mood].forEach(tabGroup => {
                this.moodLengths[mood] += tabGroup.length;
            })
        });
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        //Create the mood list
        let categoryIndex = this.state.selected;
        let categoryName = (this.props.data != undefined) ? this.props.data.categories[categoryIndex].meta.name : "Untitled";

        return <section className="kt kt-panel kt-panel-saved group-by-moodID">
            <MoodNavBar
                selectCategory={this.selectCategory}
                saveData={this.props.saveData}
                addMood={this.addMood}
                data={this.props.data}
                selected={categoryIndex} />
            {this.props.data && this.props.data.categories[categoryIndex] != undefined &&
                <MoodGroup //name={categoryName} 
                    category={this.props.data.categories[categoryIndex]}
                    // tabGroups={this.props.data.categories[categoryIndex].tabGroups}
                    onUpdate={(tabGroups) => { this.updateMood(categoryIndex, tabGroups) }}
                    saveData={this.props.saveData}
                    filter={this.props.filter} />
            }
        </section>
    }
}

