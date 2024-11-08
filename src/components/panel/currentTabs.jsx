import React, { Component, useState } from "react";
import { TabModel } from "../../models/tab.model.js";
import { TabGroup } from "../element/tabGroup.jsx";
import { Dropdown, Button, ButtonGroup, FormControl } from "react-bootstrap";
import { CreateCategory } from "../element/createCategory.jsx";
import { Browser } from "../../../public/api/shared.variables.mjs";
import { CategoryList } from "../element/categoryList.jsx";


export class CurrentTabsPanel extends Component {

    /** Number of favicons taken in account */
    faviconTakenInAccount = 0;

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props);

        this.state = {
            currentTabs: []
        };

        this.saveCurrentTabs = this.saveCurrentTabs.bind(this);
        this.getCurrentTabs = this.getCurrentTabs.bind(this);


        //Add listeners to handle the tabs changes
        // Browser.tabs.onActivated.addListener(this.getCurrentTabs);
        Browser.tabs.onRemoved.addListener(this.getCurrentTabs);
        document.addEventListener("focus",this.getCurrentTabs);
    }

    /** Before component rerender */
    componentDidUpdate() {
        if (this.props.data.icons?.references?.length > this.faviconTakenInAccount) {
            this.faviconTakenInAccount = this.props.data.icons?.references?.length;
            this.getCurrentTabs();
        }
    }

    /**
     * Get the currently opened tabs
     */
    getCurrentTabs() {
        // Get the currently openned tabs
        Browser.tabs.query({ currentWindow: true, active: false }, (tabs, _this = this) => {
            let currentTabs = {
                meta: {
                    name: "<current>"
                },
                tabs: tabs.map(tab => {
                    return new TabModel(tab);
                })
            }
            _this.setState({ currentTabs: currentTabs });
        });
    }

    /**
     * Save the currently opened tabs
     * @param {string} category Object representing the categories and his tab groups
     */
    saveCurrentTabs(category) {
        //console.log("category",category)
        //Define function content
        let save = function (tabGroups, _this) {
            let creationDate = Date.now();
            let newTabGroup = {
                "meta": {
                    "lastAccessed": creationDate,
                    "created": creationDate,
                    "name": null,
                    "deleteOnOpening": "true"
                },
                "tabs": tabGroups
            };
            category.tabGroups.unshift(newTabGroup);

            //Save the model
            _this.props.saveData();
        }
        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function (tabs, _this) {
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(new TabModel(tabs[i]));
            }

            //Filter the list
            let toSave = tabList.filter(
                tab => _this.props.filter.filter(tab));


            //Remove saved tabs
            Browser.tabs.remove(toSave.map(tab => parseInt(tab.id)), null);

            //Callback
            save(toSave, _this);
        }
        // Get the open tabs
        Browser.tabs.query({ currentWindow: true, active: false }, (tabs) => ReadTabs(tabs, this));
    }

    /**
     * Update the currently opened tab list
     * @param {Array<TabModel>} tabs Tabs opened
     */
    updateState(tabs) {
        this.setState({
            currentTabs: tabs
        });
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        if (this.props.data.categories == undefined || this.props.data.icons == undefined || this.state.currentTabs.tabs == undefined) {
            return;
        }

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
                            placeholder="Type to filter..."
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
                        <CreateCategory saveData={this.props.saveData} onCreated={(name) => this.saveCurrentTabs(name)} />
                    </div>
                );
            },
        );

        let categories = new Array();

        Object.keys(this.props.data.categories).forEach((categoryId, index) => {
            let category = this.props.data.categories[categoryId];
            categories.push(<Dropdown.Item key={index} onClick={() => this.saveCurrentTabs(category)}>{category.meta.name}</Dropdown.Item>);
        })

        if (this.state.currentTabs.tabs.length > 0) {
            // Return the current tabs panel
            return <section className="kt kt-panel kt-panel-current">
                <h2><span>Current Tabs</span> <span className="badge badge-secondary">{this.state.currentTabs.tabs.length}</span></h2>
                <TabGroup context="current"
                    filter={this.props.filter}
                    tabGroup={this.state.currentTabs}
                    saveData={this.props.saveData} />

                <Dropdown as={ButtonGroup}>
                    <Button variant="primary"
                        onClick={() => this.saveCurrentTabs(this.props.selectedCategory)}>
                        Save in {this.props.selectedCategory.meta.name}</Button>

                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                    <Dropdown.Menu as={CustomMenu}>
                        {categories}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        } else {
            return <section className="kt kt-panel kt-panel-current kt-panel-current-empty">
                <p>There is no tab openned</p>
                <small>You can choose among the saved ones or click on Open All to restore an older browsing session</small>
            </section>
        }
    }
}