import React from "react";
import { Badge, Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { Tab } from "../tab.jsx";
import { Browser, timeSince } from "../../../../public/api/shared.variables.mjs";
import { Renamable } from "../../shared/renamable/renamable.jsx";
import { Services } from "../../../services.jsx";
import { LoadingMode } from "../../../../public/api/defaultData.mjs";
import { MoveToMenu } from "../moveToMenu.jsx";
import { TabReduced } from "../tabReduced/tabReduced.jsx";
import "./tabGroup.css";
import TabService from "../../../../public/api/services/data/tabs.services.mjs";

export class TabGroup extends React.Component {

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props);
        this.state = {
            tabs: this.props.tabGroup
        };

        this.openAll = this.openAll.bind(this);
        this.delete = this.delete.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.refresh = this.refresh.bind(this);


        this.tabGroupTitle = React.createRef();
    }

    /**
     * Open All tabs of group according to filter
     */
    openAll() {
        TabService.openTabGroup(
            this.props.tabGroup.tabs,
            this.props.filter,
            this.refresh,
            this.delete
        );
    }

    /**
     * Rename the tabGroup
     * @param {String} value Name to give to the tab group
     */
    renameGroup(value) {
        this.props.tabGroup.meta.name = value;
        Services.data.save();
        this.refresh();
    }

    /**
     * Refresh tab group
     * @param {*} tabs 
     */
    refresh(tabs) {
        if(tabs) this.props.tabGroup.tabs = tabs;
        
        this.setState({
            tabs: this.props.tabGroup
        });
    }

    /**
     * Remove a tab from the list
     * @param {number} tabID Identifier of the tab
     */
    removeItem(tabID) {
        let index = this.props.tabGroup.tabs.findIndex(tab => tab.id == tabID);

        if (index != -1) {
            if (this.props.tabGroup.tabs.length == 1) {
                this.delete();
            } else {
                this.props.tabGroup.tabs.splice(index, 1);
                this.refresh();
                Services.data.save();
            }
        }
    }

    /**
     * Remove all tabs and delete this tabGroup
     */
    delete(event, filteredTabs) {
        if (!filteredTabs || this.props.tabGroup.tabs.length == filteredTabs.length) {
            this.props.deleteFunction();
            this.props.onUpdate();
        } else {
            let tokenForDeletion = [];
            filteredTabs.forEach(tab => {
                //Prepare for deletion
                tokenForDeletion.push(this.props.tabGroup.tabs.findIndex(tabInGroup => tabInGroup == tab));
            });
            //Remove openned tabs
            this.props.tabGroup.tabs = this.props.tabGroup.tabs.filter(
                (tab, index) => tokenForDeletion.indexOf(index) == -1);

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
    render() {
        let filteredTabs = TabService.filter(this.props.tabGroup.tabs,this.props.filter);
        // Returns nothing if the tab list is empty
        if (filteredTabs.length == 0)
            return;

        //Create the tab list
        let tabList = filteredTabs.map(
            (tab, index) => <Tab key={tab.id} index={index} tab={tab} delete={() => { this.removeItem(tab.id) }} context={this.props.context} />);

        // Define the date of the tabgroup (currently by pick the date of the first element)
        let date = new Date(this.props.tabGroup.meta?.lastAccessed ?? filteredTabs[0].lastAccessed);
        let areSavedTabs = this.props.context == "saved";

        let className = "kt kt-component kt-component-tabgroup tabs";
        className += this.props?.inBasket ? " tabs-in-basket":"";

        this.props.tabGroup.meta.name = this.props.tabGroup.meta.name ?? "";

        let tabGroupKey = `${this.props.category?.meta?.name}-${this.props.id}`;

        return <div className={className} style={{ "--tabs": tabList.length + 2 }}>
            {/* Show the number of tabs and when it as been saved */}
            {areSavedTabs &&
                <div>
                    <span className="tab-group-header" onClick={this.tabGroupTitle?.current?.enableEdition}>
                        <Renamable ref={this.tabGroupTitle}
                            key={tabGroupKey}
                            value={this.props.tabGroup.meta.name}
                            onSubmit={(value) => { this.renameGroup(value) }}></Renamable>
                        <span className="time-ago" >{timeSince(date)} ago</span>
                        <span className="tabs-count">
                            <Badge pill bg="secondary">{filteredTabs.length}</Badge>
                            <span>tabs</span>
                        </span>
                    </span>
                </div>
            }

            {/* Show the list of tabs */}
            {areSavedTabs &&
                <ul className="list-group">
                    {tabList}
                </ul>
            }
            {!areSavedTabs &&
                <ul className="list-group">
                    {tabList.slice(0, 6)}
                    <TabReduced tabList={filteredTabs.slice(7,)}></TabReduced>
                </ul>
            }

            {/* Show the action buttons */}
            {areSavedTabs &&
                <ButtonGroup>
                    <Button onClick={this.openAll}>Open all</Button>
                    <MoveToMenu
                        tabGroup={this.props.tabGroup}
                        filteredTabs={filteredTabs}
                        category={this.props.category}
                    ></MoveToMenu>
                    <Button onClick={(event) => { this.delete(event, filteredTabs) }}>Delete</Button>

                    <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown">
                        <Dropdown.Item eventKey="1">Move to category</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Split on match</Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
            }
        </div>
    }
}