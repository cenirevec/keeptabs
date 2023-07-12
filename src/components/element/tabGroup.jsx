import React from "react";
import { Badge, Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { Tab } from "./tab.jsx";
import { Browser, timeSince } from "../../../public/api/shared.variables.mjs";
import { Renamable } from "../shared/renamable/renamable.jsx";
import { Services } from "../../services.jsx";
import { LoadingMode } from "../../../public/api/defaultData.mjs";
import { MoveToMenu } from "./moveToMenu.jsx";

export class TabGroup extends React.Component{  

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        this.state = {
            tabs: this.props.tabGroup
        };

        this.openAll = this.openAll.bind(this);
        this.delete = this.delete.bind(this);
        this.removeItem = this.removeItem.bind(this);
        

        this.tabGroupTitle = React.createRef();
    }

    /**
     * Open all the tabs in this group
     */
    openAll(options){
        let filteredTabs = this.filter(this.props.filter);
        let tokenForDeletion = [];

        let loadingType = Services.data.getSetting("loading.mode");
        let lastIsActive = Services.data.getSetting("loading.makeOpenedTabActive")

        let timeStamp;

        filteredTabs.forEach((tab,index) => {
            //Open all the tab in lazyMode
            if(loadingType == LoadingMode.LAZY){
                Browser.tabs.create({url: tab.url, discarded:true, active:lastIsActive});
            }

            //Prepare for deletion
            tokenForDeletion.push(this.props.tabGroup.tabs.findIndex(tabInGroup => tabInGroup == tab));
        });

        if(loadingType == LoadingMode.DIFFERED){
            timeStamp = Date.now();
            let interval = Services.data.getSetting("loading.interval");

            let openNext = (index) => {
                // Load the next tab
                let loadNext = (result)=>{
                    index += 1;
                    if(index < filteredTabs.length){
                        setTimeout(()=>{
                            openNext(index)}
                        , interval)
                    }
                };

                // Open a tab
                browser.tabs.create(
                    {url: filteredTabs[index].url, active:lastIsActive})
                .then(loadNext,loadNext);
            };

            openNext(0);
        }

        //Remove openned tabs
        this.props.tabGroup.tabs = this.props.tabGroup.tabs.filter(
            (tab,index)=> tokenForDeletion.indexOf(index) == -1);

        //Delete the tabgroup if all tabs have been openned and/or deleted
        if(this.props.tabGroup.tabs.length == 0){
          this.delete();
        }
        //Save the modification
        Services.data.save();
    }

    /**
     * Rename the tabGroup
     * @param {String} value Name to give to the tab group
     */
    renameGroup(value){
        this.props.tabGroup.meta.name = value;
        Services.data.save();
        this.refresh();
    }

    refresh(){
        this.setState({
            tabs: this.props.tabGroup
        });
    }

    /**
     * Filter the tab list according to searchbar parameters
     * @param {searchBarParameters} params Searchbar filters
     * @returns 
     */
    filter(params){
        let filteredTabs = [];
        let source = this.props.tabGroup.tabs;

        if (source != undefined) {
            filteredTabs = source.filter(
                tab => params.filter(tab));
        }
        return filteredTabs;
    }

    /**
     * Remove a tab from the list
     * @param {number} tabID Identifier of the tab
     */
    removeItem(tabID){
        let index = this.props.tabGroup.tabs.findIndex(tab=>tab.id == tabID);

        if(index != -1){
            if(this.props.tabGroup.tabs.length == 1){
                this.delete();
            }else{
                this.props.tabGroup.tabs.splice(index,1);
                Services.data.save();
            }
        }
    }

    /**
     * Remove all tabs and delete this tabGroup
     */
    delete(event,filteredTabs){
        if(!filteredTabs || this.props.tabGroup.tabs.length == filteredTabs.length){
            this.props.deleteFunction();
            this.props.onUpdate();
        }else{
            let tokenForDeletion = [];
            filteredTabs.forEach(tab => {
                //Prepare for deletion
                tokenForDeletion.push(this.props.tabGroup.tabs.findIndex(tabInGroup => tabInGroup == tab));
            });
            //Remove openned tabs
            this.props.tabGroup.tabs = this.props.tabGroup.tabs.filter(
                (tab,index)=> tokenForDeletion.indexOf(index) == -1);
            
            //Refresh and save
            this.setState({
                tabs: this.props.tabGroup.tabs
            })
            Services.data.save();
        }
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
            (tab)=> <Tab key={tab.id} tab={tab} delete={()=>{this.removeItem(tab.id)}} context={this.props.context}/>);

        // Define the date of the tabgroup (currently by pick the date of the first element)
        let date = new Date(this.props.tabGroup.meta?.lastAccessed ?? filteredTabs[0].lastAccessed); 
        let areSavedTabs = this.props.context == "saved";

        let className = "kt kt-component kt-component-tabgroup tabs";
        className += areSavedTabs ? " col-lg-6":"";

        this.props.tabGroup.meta.name = this.props.tabGroup.meta.name ?? "";

        return <div className={className}>
                    {/* Show the number of tabs and when it as been saved */}
                    {areSavedTabs && 
                        <div>
                            <span className="tab-group-header" onClick={this.tabGroupTitle?.current?.enableEdition}>
                                <Renamable  ref={this.tabGroupTitle} 
                                            value={this.props.tabGroup.meta.name} 
                                            onSubmit={(value)=>{this.renameGroup(value)}}></Renamable>
                                <span className="time-ago" >{timeSince(date)} ago</span>
                                <span className="tabs-count">
                                    <Badge pill bg="secondary">{filteredTabs.length}</Badge>
                                    <span>tabs</span>
                                </span>
                            </span>
                        </div>
                    }

                    {/* Show the list of tabs */}
                    <ul className="list-group">
                        {tabList}
                    </ul>

                    {/* Show the action buttons */}
                    {areSavedTabs && 
                    <ButtonGroup>
                        <Button onClick={this.openAll}>Open all</Button>
                        <MoveToMenu tabGroup={this.props.tabGroup} category={this.props.category}></MoveToMenu>
                        <Button onClick={(event)=>{this.delete(event,filteredTabs)}}>Delete</Button>
                    
                        <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown">
                            <Dropdown.Item eventKey="1">Move to category</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Split on match</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>
                    }
                </div>
    }   
}