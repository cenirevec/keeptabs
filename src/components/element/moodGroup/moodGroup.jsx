import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { TabGroup } from "../tabGroup/tabGroup.jsx";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { Services } from "../../../services.jsx";
import "./moodGroup.css"
import TabService from "../../../../public/api/services/data/tabs.services.mjs";

export class MoodGroup extends React.Component {
    /**
     * Number of elements
     */
    length = 0;

    /**
     * Number of hidden elements
     */
    hiddenElements = 0;

    /**
     * Load limit
     */
    ShownGroups = 10;

    /***
     * One day
     */
    DAY = 24 * 3600 * 1000;

    /**
     * Default number of loaded tabs
     */
    DEFAULT_LOADED_TABS = 10;

    /**
 * Constructor
 * @param {Object} props Component's attributes
 */
    constructor(props) {
        super(props);

        this.state = {
            tabGroups: this.props.category.tabGroups,
            enableScrollToTop: false,
            loadedTabGroups: 10
        };
        this.removeTabGroup = this.removeTabGroup.bind(this);
        this.scrollNeeded = false;
        this.renderableTabs = [];

        this.scrollToTop = this.scrollToTop.bind(this);
        this.detectScroll();
    }

    /** Just before update */
    shouldComponentUpdate(nextProps, nextStates) {
        //console.log(nextProps)
        if (nextProps.category.meta.name !== this.props.category.meta.name) {
            this.setState({
                loadedTabGroups: this.DEFAULT_LOADED_TABS
            })
        }
        return true;
    }

    /**
     * Detect when the scrollbar hits the bottom and load the next tabs
     */
    detectScroll() {
        let webpage = document.getElementById("react-target");
        //console.log(webpage);

        let hasReachedBottom = () => {
            if (webpage.scrollTop == 0 && this.state.enableScrollToTop) {
                this.setState({
                    enableScrollToTop: false
                })
            } else if (webpage.scrollTop > 0 && !this.state.enableScrollToTop) {
                this.setState({
                    enableScrollToTop: true
                })
            }

            if (!this.scrollNeeded &&
                (webpage.scrollTop + document.body.offsetHeight) >= webpage.scrollTopMax) {
                if (this.state.loadedTabGroups < this.props.category.tabGroups.length) {
                    //console.log("Add tabgroups")
                    this.setState({
                        loadedTabGroups: this.state.loadedTabGroups += this.DEFAULT_LOADED_TABS / 2
                    });
                    this.scrollNeeded = true;
                }
            } else {
                //console.log("ça va (loadedTabGroups: " + this.state.loadedTabGroups + ")");
                this.scrollNeeded = false;

            }
        }

        setInterval(hasReachedBottom, 100);
    }

    scrollToTop() {
        let webpage = document.getElementById("react-target");

        webpage.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        this.setState({
            enableScrollToTop: false,
            // loadedTabGroups: this.DEFAULT_LOADED_TABS
        });
        // console.log("ça va (loadedTabGroups: " + this.state.loadedTabGroups + ")");
    }

    /**
     * TO MOVE SOMEWHERE ELSE Check if the data from this category and incomplete and complete if necessary
     */
    cleanDataModel() {
        //Set default hidden date
        if (!this.props.category.meta.hasOwnProperty("hidden")) {
            this.props.category.meta.hidden = -1;
            Services.data.save();
        }

        //Set default expiration date
        if (!this.props.category.meta.hasOwnProperty("expiration")) {
            this.props.category.meta.expiration = -1;
            Services.data.save();
        }

        //Withdraw the empty tabGroups
        this.props.category.tabGroups =
            this.props.category.tabGroups.filter((tabGroup) => tabGroup.tabs.length > 0);

        //Delete expired tab groups
        if (this.props.category.meta.hasOwnProperty("expiration")
            && this.props.category.meta.expiration > -1) {

            this.props.category.tabGroups =
                this.props.category.tabGroups.filter((tabGroup) =>
                    (Date.now() - tabGroup.meta.lastAccessed) <= this.props.category.meta.expiration * this.DAY);
            //Services.data.save();
        }
    }

    /**
     * Check if the tab has to be hidden based on date of expiration
     * @param {*} tabGroup Tab Group to check
     * @returns
     */
    checkHidden(tabGroup) {
        if (this.props.category.meta.hidden == -1) return false;

        return (Date.now() - tabGroup.meta.lastAccessed) > this.props.category.meta.hidden * this.DAY;
    }

    /**
     *  TO INCLUDE IN RENDER HIDDEN TABS - Count the elements that are hidden
     */
    countHiddenElements() {
        this.length = 0;
        this.hiddenElements = 0;
        this.props.category.tabGroups.forEach(tabGroup => {
            this.length += tabGroup.tabs.length;
            if (this.checkHidden(tabGroup)) {
                this.hiddenElements += tabGroup.tabs.length;
            }
        });
    }

    /**
     * Remove the tab group
     * @param {number} tabGroupId Id of the tab group
     */
    removeTabGroup(tabGroupId) {
        this.props.category.tabGroups.splice(tabGroupId, 1);
        this.props.saveData();
    }

    /**
     *
     * @returns
     */
    renderTabs() {

        this.renderableTabs = this.props.category.tabGroups
            .filter((tabGroup, index) => !this.checkHidden(tabGroup))

        return this.renderableTabs
            .slice(0, this.state.loadedTabGroups)
            .map(
                (tabGroup, index, array) =>
                    <TabGroup key={index}
                        id={index}
                        category={this.props.category}
                        saveData={this.props.saveData}
                        onUpdate={this.props.onUpdate}
                        deleteFunction={() => { this.removeTabGroup(index) }}
                        filter={this.props.filter}
                        tabGroup={tabGroup} context="saved" />);
    }

    /**
     *
     * @returns
     */
    renderHiddenTabs() {
        let hiddenTabsToRender = Math.max(0, this.state.loadedTabGroups - this.renderableTabs.length);
        //console.log(hiddenTabsToRender)
        //return;
        return this.props.category.tabGroups
            .filter((tabGroup, index) => this.checkHidden(tabGroup))
            .slice(0, hiddenTabsToRender)
            .map(
                (tabGroup, index, array) =>
                    <TabGroup key={index}
                        id={index}
                        inBasket={true}
                        category={this.props.category.meta.name}
                        saveData={this.props.saveData}
                        onUpdate={this.props.onUpdate}
                        deleteFunction={() => { this.removeTabGroup(index) }}
                        filter={this.props.filter}
                        tabGroup={tabGroup} context="saved" />);
    }

    /**
     * Open a random tab group from the category
     * @param {*} category
     */
    openRandomTabGroup(category) {
        //console.log(category,this.props.filter);
        let tabGroupId = Date.now() % category.tabGroups.length;
        //console.log();
        let tabGroup = category.tabGroups[tabGroupId];

        //Delete a tabGroup if all tabs are loaded
        let onDelete = () => {
            category.tabGroups.splice(tabGroupId, 1);
            this.props.saveData();
        };

        TabService.openTabGroup(
            tabGroup.tabs,
            this.props.filter,
            (tabs) => { tabGroup.tabs = tabs; Services.main?.refresh() },
            onDelete
        )
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        if (this.props.category.tabGroups == undefined)
            return;

        this.cleanDataModel();

        //Create the list of visible tab groups
        let tabgroupList = this.renderTabs();

        //Create the list of hidden tab groups
        let hiddenTabgroupList = this.renderHiddenTabs();

        //Count the hidden elements
        this.countHiddenElements();

        let classForScrollBtn = (this.state.enableScrollToTop) ? "" : "hide-btn";

        let openRandomButton = (
            <Button variant="primary" className="kt kt-open-rand-btn"
                onClick={() => this.openRandomTabGroup(this.props.category)}>
                Open random tabs</Button>
        )



        return <div className="kt kt-component kt-component-moodgroup">
            {tabgroupList.length > 0 && <>
                <div className="kt-component-moodgroup-header">
                    <h3>{this.props.category.meta.name}</h3>
                    <i className="description">Description...</i>
                    {openRandomButton}
                </div>
                {tabgroupList}
            </>}
            {this.props.category.tabGroups.length == 0 &&
                <div className="empty">
                    <p>There is no tab saved in {this.props.category.meta.name}</p>
                    <small>You can add the current tabs by clicking on the <Button className="disabled">Save</Button> button</small>
                </div>
            }


            {hiddenTabgroupList.length > 0 &&
                <h3 className="notify-expiracy">The following tab groups will soon reach expiration date and will be removed</h3>
            }
            {hiddenTabgroupList}
            <Button className={"scroll-top-bttn " + classForScrollBtn} onClick={this.scrollToTop}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5" />
                </svg>
            </Button>
        </div>
    }
}