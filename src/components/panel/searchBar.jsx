import React, { Component } from "react";
import { InputText } from 'primereact/inputtext';
import { searchParameters } from "../../models/searchFilter.model";
import Chip from "../element/chip.jsx";

export class SearchBarPanel extends Component{
    /** Parameters linked to the searchbar */
    params = new searchParameters();

        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);

        this.state ={
            searchbarContent : ""
        };
        
        this.setValue = this.setValue.bind(this);
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
        //this.updateFilter = this.updateFilter.bind(this);
        this.clear = this.clear.bind(this);
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
        let lastIndex = this.params.values.length -1;
        this.setState({
            searchbarContent: value
        })
        this.params.values[lastIndex] = value;
        this.updateFilter();
    }

    /**
     * Update the searchbar filter in the other components
     */
    updateFilter(){
        this.props.onFilter(this.params);
    }

    addValue(event){
        if(event.keyCode == 13){
            this.clearSearchbar()
            this.params.values.push(event.target.value);
            //console.log(this.params.values)
            this.updateFilter();
        }
    }

    removeValue(index){
        this.params.removeValue(index);
        this.updateFilter();
    }

    clear(){
        this.params.clearValues();
        this.clearSearchbar();
        this.updateFilter();
    }

    clearSearchbar(){
        this.setState({
            searchbarContent: ""
        })
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        let valueChips = this.params.values.map((value,index)=>{
            if(value != '' && index != this.params.values.length -1){
                return <Chip key={index} onRemove={()=>this.removeValue(index)}
                             value={value}>
                    </Chip>
            }
        });

        return <section id="searchbox" className={(this.params.values.length > 1)?'asValues':''}>
            <div>
                {valueChips}
                <div className="actionPill">

                </div>
            </div>
            <div className="searchbar">
                <InputText
                        value={this.state.searchbarContent}
                        placeholder="Search" 
                        onChange={(e) => this.setValue(e.target.value)} 
                        onKeyDown={this.addValue}/>
                <div className="actions">
                    <svg onClick={this.clear} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle erase" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </div>
            </div>
            
        </section>
    }
}