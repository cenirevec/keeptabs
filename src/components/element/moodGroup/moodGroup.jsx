import React from "react";
import { Button } from "react-bootstrap";
import { TabGroup } from "../tabGroup/tabGroup.jsx";
import { Services } from "../../../services.jsx";
import "./moodGroup.css"
import TabService from "../../../../public/api/services/data/tabs.services.mjs";
import { CategoryMenu } from "../categoryMenu/categoryMenu.jsx";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { REFRESH_RATE } from "../../../../public/api/shared.variables.mjs";

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

    loadedTabs = {
        shown: [],
        hidden: []
    }

    /**
 * Constructor
 * @param {Object} props Component's attributes
 */
    constructor(props) {
        super(props);

        this.ref = React.createRef();
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
                    this.setState({
                        loadedTabGroups: this.state.loadedTabGroups += this.DEFAULT_LOADED_TABS / 2
                    });
                    this.scrollNeeded = true;
                }
            } else {
                this.scrollNeeded = false;
            }
        }

        setInterval(hasReachedBottom, REFRESH_RATE);
    }

    scrollToTop() {
        let webpage = document.getElementById("react-target");

        webpage.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        this.setState({
            enableScrollToTop: false
        });
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
            Services.data.save();
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
     * Search for tab groups in the DOM after filter being applied
     * @returns Whether or not there are still tab groups
     */
    hasNoneInFilter() {
        let node = this.ref.current;
        return !!node &&
            node.getElementsByClassName("kt-component-tabgroup").length == 0;
    }

    /************************************************
     *                  RENDER METHODS
     **************************************************/

    /**
     *
     * @returns
     */
    renderTabs() {

        this.renderableTabs = this.props.category.tabGroups
            .filter((tabGroup) => !this.checkHidden(tabGroup))

        return this.renderableTabs
            .slice(0, this.state.loadedTabGroups)
            .map(
                (tabGroup, index) =>
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

        return this.props.category.tabGroups
            .filter((tabGroup) => this.checkHidden(tabGroup))
            .slice(0, hiddenTabsToRender)
            .map(
                (tabGroup, index) =>
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
            <Button variant="outline-secondary" className="kt kt-open-rand-btn"
                onClick={() => TabService.openRandomTabGroup(this.props.category, this.props.filter)}>
                {t("savedTabs.openRandom")}</Button>
        )
        // Improve readability
        let defaultDesc = this.props.category.meta.translationDescription;

        //Check if there are tabgroups after applying filter
        let hasNoneInFilter = this.hasNoneInFilter();


        return <div ref={this.ref} className="kt kt-component kt-component-moodgroup">
            <div className="kt-component-moodgroup-header">
                <p className="description">
                    {defaultDesc &&
                        <> {t(defaultDesc)}</>}
                    {!defaultDesc && <>
                        {(this.props.category.meta.description) ?
                            this.props.category.meta.description
                            : <i>{t("common.desc")}...</i>}</>}
                </p>
                <CategoryMenu
                    category={this.props.category}
                    categoryId={this.props.categoryId}
                    selected={true}
                    renameItem={() => { }}></CategoryMenu>
                {tabgroupList.length > 0 && openRandomButton}
            </div>
            {tabgroupList.length > 0 && <>
                {tabgroupList}
            </>}
            {this.props.category.tabGroups.length == 0 &&
                <div className="empty">
                    <p>{t("savedTabs.noTabsIn", { category: this.props.category.meta.name })}</p>
                    <small>
                        <Trans i18nKey="savedTabs.noTabsInAdvice">
                            You can add the current tabs by clicking on the <Button className="disabled">Save</Button> button
                        </Trans>
                    </small>
                </div>
            }
            {hasNoneInFilter &&
                <div className="empty">
                    <div>
                        <p>{t("currentTabs.noneInFilter")}</p>
                        <small>{t("currentTabs.noneInFilterAdvice")}</small>
                    </div>
                </div>
            }


            {(!hasNoneInFilter && hiddenTabgroupList.length > 0) &&
                <h3 className="notify-expiracy">{t("savedTabs.notifyExpiracy")}</h3>
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