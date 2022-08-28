import React, { Component } from "react";
import { InputText } from 'primereact/inputtext';
import { searchBarParameters } from "../../models/searchFilter.model";

export class SearchBarPanel extends Component{
    /** Parameters linked to the searchbar */
    params = new searchBarParameters();

        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        
        this.setValue = this.setValue.bind(this)
    }

    /**
     * Use search algorithm to filter the tabs
     * @param {*} expression 
     */
    search(expression){
        var searchAlgorithm = new SearchAlgorithm();

        searchAlgorithm.init(TabService.loadedTabs.main);
        searchAlgorithm.search(expression);        

        TabService.renderSavedTabs();
    }

    /**
     * Set a value
     * @param {string} value Text entered in the searchbar
     */
    setValue(value){
       this.params.values[0] = value;
       this.updateFilter();
    }

    /**
     * Update the searchbar filter in the other components
     */
    updateFilter(){
        this.props.onFilter(this.params);
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        return <section id="searchbox">
            {//<div>Bonjour</div>
            }
            <InputText className="form-control" 
                       placeholder="Search" 
                       onChange={(e) => this.setValue(e.target.value)} />
        </section>
    }
}