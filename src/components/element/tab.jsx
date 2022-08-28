import React from "react";
import { timeSince } from "../../../public/api/shared.variables.mjs";

export class Tab extends React.Component{  
    
    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props)
       // this.props = props.dto;
    }


    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        if(this.props.dto == undefined)
            return;

        let addedClasses = "";
        const {url,title,lastAccessed} = this.props.dto;

        let favicon = this.props.dto.favicon;
        if(favicon == undefined || favicon == "" || favicon == null){
            addedClasses+="no-icon ";
            favicon='/media/ico-48.png';
        }

        let date = new Date(lastAccessed);

        return <li className="kt kt-component kt-component-tab list-group-item list-group-item-action">
            <img src={favicon} className={addedClasses} title="Click to select this link"/>
            <a href={url} target="_blank">{title}</a>
            <small>{timeSince(date)}</small>
        </li>;
    }
}

class poubelle{
    /*      /** Open the tab
    Returns if the tab is opened of not */
    open(options){
        /* if (this.isHidden || (!this.selected && TabService.mode.selection)) {
            return false;
        } else {
            options = (options == undefined || options == null)? {}:options;
            options["url"] = this.url;

            Browser.tabs.create(options);
            return true;
        } */
    }

    /**
     * Check if the text matches the regular expression
     * @param {string} regexp Regular expression
     * @returns True if the text matches the regular expression, False otherwise
     */
    match(regexp){/* 
        let text = this.url.concat(" "+this.title);
        
        if(text.search(regexp) > -1){
            return true;
        }else{
            return false;
        } */
    }

    /**
     * Display the tab
     * @param {boolean} boolean True if the tab should be displayed, False otherwise
     */
    show(boolean){
       // this.isHidden = !boolean;
    }

    /**
     * Select the tab
     * @param {boolean} boolean True if the tab should be selected, False otherwise
     */
    toggleSelected(boolean){/* 
        this.selected = (boolean != undefined)? boolean : !this.selected;

        if (this.selected) {
            TabService.changeNumberOfSelectedTabs(1);
        } else {
            TabService.changeNumberOfSelectedTabs(-1);
        } */
    }

    /**
     * Get an unique tab identifier
     * @returns An unique tab identifier
     */
    getIdentifier(){
      //  return this.id + "" + this.groupId + "" + this.lastAccessed;
    }

    /**
     * Compare this tab to another by their identifiers
     * @param {Tab} tab Tab to compare
     * @returns True if the tab is the same, False otherwise
     */
    compareTo(tab){
        /* let identifier1 = this.getIdentifier();
        let identifier2 = tab.getIdentifier();

        return identifier1 == identifier2; */
    }

    /**
     * Find the index of the tab in an array
     * @param {*} array 
     * @returns The index of the tab
     */
    findIn(array){
/*         for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.compareTo(this)){
                return index;
            }
        }
        return -1; 
    } */
}
}