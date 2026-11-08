import React, { Component, useState } from "react";
import { TabModel } from "../../../models/tab.model.js";
import { TabGroup } from "../../element/tabGroup/tabGroup.jsx";
import { Dropdown, Button, ButtonGroup, FormControl } from "react-bootstrap";
import { Browser, icons, REFRESH_RATE } from "../../../../public/api/shared.variables.mjs";
import TabService from "../../../../public/api/services/data/tabs.services.mjs";
import { Services } from "../../../services.jsx";
import "./currentTabs.css";
// Test
import { t } from "i18next";

export class CurrentTabsPanel extends Component {

    /** Number of favicons taken in account */
    faviconTakenInAccount = 0;

    /**
     * Last list of current tabs
     */
    lastTabs = [];

    /**
     * Last list of current tabs
     */
    currentTabs = { tabs: [] };

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props);

        this.state = {
            currentTabs: [],
            toggleRefresh: false
        };

        this.saveCurrentTabs = this.saveCurrentTabs.bind(this);
        this.refreshCurrentTabs = this.refreshCurrentTabs.bind(this);
        
        //Add listeners to handle the tabs changes
        window.setInterval(this.refreshCurrentTabs, REFRESH_RATE);
    }

    /** Before component rerender */
    componentDidUpdate() {
        if (this.props.data.icons?.references?.length > this.faviconTakenInAccount) {
            this.faviconTakenInAccount = this.props.data.icons?.references?.length;
            this.refreshCurrentTabs();
        }
    }

    /**
     * Get the currently opened tabs
     * @param {*} func 
     * @param {*} options 
     */
    _getCurrentTabs(func, options) {
        Browser.tabs.query({ currentWindow: true }, (tabs, _this = this) => {
            //@TODO vérifier que changement ?
            if (this.lastTabs == tabs && options.triggerIfNew) {
                console.log("S'arrête là")
                return;
            }



            tabs = tabs.filter(tab => tab.url != document.URL).map(tab => {
                return new TabModel(tab);
            });


            //Filter based on searchbar input
            if (options.filtered) {
                tabs = tabs.filter(
                    tab => _this.props.filter.filter(tab));
            }

            //Execute function with the given data
            func(tabs, _this);
        });

    }

    /**
     * Save the data model and refesh
     */
    saveModel() {
        if (Services.data.model) {
            Services.data.save(() => {
                this.setMoods(Services.data.model);
            })
        }
    }

    //// UI ///////////////

    /**
 * Get the currently opened tabs
 */
    refreshCurrentTabs() {
        // Get the currently openned tabs
        this._getCurrentTabs((tabs) => {
            //console.log("spam or not to spam?")
            let currentTabs = {
                meta: {
                    name: "<current>"
                },
                tabs
            }

            if (this.lastTabs.length !== tabs.length) {
                this.setState({ toggleRefresh: !this.state.toggleRefresh });
                console.log("whole refresh")
            }

            this.lastTabs = tabs;
            this.currentTabs = currentTabs;

        }, { triggerIfNew: true })
    }

    /**
     * Save the currently opened tabs
     * @param {string} category Object representing the categories and his tab groups
     */
    saveCurrentTabs(category) {
        // Get the open tabs
        this._getCurrentTabs((tabs) => {
            //Remove saved tabs
            Browser.tabs.remove(tabs.map(tab => parseInt(tab.id)), null);

            //Create a tab group based on current tabs
            let creationDate = Date.now();
            let newTabGroup = {
                "meta": {
                    "lastAccessed": creationDate,
                    "created": creationDate,
                    "name": null,
                    "deleteOnOpening": "true"
                },
                "tabs": tabs
            };

            category.tabGroups.unshift(newTabGroup);
            //Save the model
            this.props.saveData();
        }, { filtered: true });
    }

    //////////////// RENDERING ////////////
    renderDropdownMenu() {
        // Dropdown needs access to the DOM of the Menu to measure it
        const CustomMenu = React.forwardRef(
            ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
                const [value, setValue] = useState('');

                return (
                    <div
                        ref={ref}
                        style={style}
                        className={className}
                        aria-labelledby={labeledBy}
                    >
                        <FormControl
                            autoFocus
                            className="mx-3 my-2 w-auto"
                            placeholder={t("currentTabs.filter")}
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                        <ul className="list-unstyled">
                            {React.Children.toArray(children).filter(
                                (child) =>
                                    !value || child.props.children.toLowerCase().startsWith(value),
                            )}
                        </ul>
                        <Dropdown.Divider />
                        {/* <CreateCategory type="contextual" context-value={value} onCreated={(name) => this.saveCurrentTabs(name)} /> */}
                        + {t("currentTabs.create", { value })}
                    </div>
                );
            },
        );

        //Generate an item by existing category
        let categories = new Array();
        Object.keys(this.props.data.categories).forEach((categoryId, index) => {
            let category = this.props.data.categories[categoryId];
            categories.push(<Dropdown.Item key={index} onClick={() => this.saveCurrentTabs(category)}>{category.meta.name}</Dropdown.Item>);
        })

        //Actually render the dropdown menu
        return (<Dropdown.Menu as={CustomMenu}>
            {categories}
        </Dropdown.Menu>)

    }

    renderCurrentTabs(categoryNameLabel) {
        return <section className="kt kt-panel kt-panel-current">
            <h2>
                <span className="title">
                    {t("currentTabs.opened")}
                </span>
                <span className="tabs-count">
                    <img src={icons.tabs} role="img" alt=""></img>
                    <span>{t("common.tabs", { count: this.currentTabs.tabs.length })}</span>
                </span>
            </h2>

            <TabGroup context="current"
                filter={this.props.filter}
                tabGroup={this.currentTabs}
                saveData={this.props.saveData} />

            <Dropdown drop="end" as={ButtonGroup}>
                <Button variant="primary"
                    onClick={() => this.saveCurrentTabs(this.props.selectedCategory)}>
                    {t("currentTabs.saveIn", { category: categoryNameLabel })}</Button>


                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                {this.renderDropdownMenu()}
                {/* <Dropdown.Menu as={CustomMenu}>
                    {categories}
                </Dropdown.Menu> */}
            </Dropdown>
        </section>
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        if (this.props.data.categories == undefined || this.props.data.icons == undefined || this.currentTabs.tabs == undefined) {
            return;
        }

        let categoryNameLabel = (this.props.selectedCategory.meta.translationLabel) ?
            t(this.props.selectedCategory.meta.translationLabel) :
            this.props.selectedCategory.meta.name;

        if (this.currentTabs.tabs.length > 0) {
            // Return the current tabs panel
            return this.renderCurrentTabs(categoryNameLabel);
        } else {
            return <section className="kt kt-panel kt-panel-current kt-panel-current-empty">
                <div>
                    <p>{t("currentTabs.noneOpened")}</p>
                    <small>{t("currentTabs.noneOpenedAdvice")}</small>
                </div>
                {/* Open random tab button*/}
                <Button variant="primary" className="kt kt-open-rand-btn"
                    onClick={() =>
                        TabService.openRandomTabGroup(
                            this.props.selectedCategory,
                            this.props.filter)}>
                    {t("savedTabs.openRandomFrom", { category: categoryNameLabel })}</Button>
            </section>
        }
    }
}