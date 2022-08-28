import React from "react";
import { Badge, Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { Tab } from "./tab.jsx";
import { timeSince } from "../../../public/api/shared.variables.mjs";
import { TabService } from "../../../public/api/services/oldServices/tab.service.mjs";

export class TabGroup extends React.Component{  

        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        this.state = {
            tabs: this.props.tabs
        };

        this.openAll = this.openAll.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * Open all the tabs in this group
     */
    openAll(){
        const {category,id} = this.props;
        TabService.OpenAllTabsByGroupID(this.props.tabs);
        this.props.onUpdate();

        this.delete();
    }

    /**
     * Filter the tab list according to searchbar parameters
     * @param {searchBarParameters} params Searchbar filters
     * @returns 
     */
    filter(params){
        let filteredTabs = this.props.tabs.filter(
            tab=>tab.title.toLowerCase().indexOf(params.values[0].toLowerCase()) != -1);

        return filteredTabs;
    }

    /**
     * Remove a tab from the list
     * @param {number} tabID Identifier of the tab
     */
    removeItem(tabID){
        let index = this.props.tabs.findIndex(tab=>tab.id == tabID);

        if(index == -1){
            console.error("Cannot find a tab with the given id : "+tabID);
        }else{
            this.props.tabs.splice(index,1);
            console.warn("Needs to remove it from the storage")
        }
    }

    /**
     * Remove all tabs and selete this tabGroup
     */
    delete(){
        this.props.deleteFunction();
        this.props.onUpdate();
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        let filteredTabs = this.filter(this.props.filter);
        // Returns nothing if the tab list is empty
        if(filteredTabs.length == 0)
            return;

        //Create the tab list
        let tabList = filteredTabs.map(
            (tab)=> <Tab key={tab.id} dto={tab} context={this.props.context}/>);

        let date = new Date(filteredTabs[0].lastAccessed);
        let areSavedTabs = this.props.context == "saved";

        let className = "kt kt-component kt-component-tabgroup tabs";
        className += areSavedTabs ? " col-lg-6":"";

        return <div className={className}>
                    {areSavedTabs && 
                        <div>
                            <p className="time-ago">{timeSince(date)} ago
                                <span className="tabs-count">
                                    <Badge pill bg="secondary">{filteredTabs.length}</Badge>
                                    <span>tabs</span>
                                </span>
                            </p>
                        </div>
                    }
                    <ul className="list-group">
                        {tabList}
                    </ul>
                    {areSavedTabs && 
                    <ButtonGroup>
                        <Button onClick={this.openAll}>Open all</Button>
                        <Button onClick={this.delete}>Delete</Button>
                    
                        <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown">
                            <Dropdown.Item eventKey="1">Change category</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Split</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>
                    }
                </div>
    }   
}