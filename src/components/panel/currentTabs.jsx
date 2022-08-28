import React, { Component, useState } from "react";
import { TabService } from "../../../public/api/services/oldServices/tab.service.mjs";
import { TabModel } from "../../models/tab.model.js";
import { TabGroup } from "../element/tabGroup.jsx";
import { Dropdown, Button, ButtonGroup, FormControl } from "react-bootstrap";
import { CreateCategory } from "../element/createCategory.jsx";
import { Browser } from "../../../public/api/shared.variables.mjs";

export class CurrentTabsPanel extends Component{  


    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);

        this.getCurrentTabs = this.getCurrentTabs.bind(this);
        this.getCurrentTabs();
        this.state = {
            currentTabs: []
        };
        
        
        //Add listeners to handle the tabs changes
        Browser.tabs.onActivated.addListener(this.getCurrentTabs);
        Browser.tabs.onRemoved.addListener(this.getCurrentTabs);
    }

    /**
     * Get the currently opened tabs
     */
    getCurrentTabs(){
        TabService.getCurrentlyOpenTabs((tabs)=>{
            this.updateState(tabs)
        })
    }

    /**
     * Save the currently opened tabs
     * @param {string} category Name of the category in which store the currently opened tabs
     */
    saveCurrentTabs(category){
        TabService.saveCurrentTabs(category,(tabs)=>{
            this.props.setMoods(tabs);
        });
        
    }
    
    

    /**
     * Update the currently opened tab list
     * @param {Array<TabModel>} tabs Tabs opened
     */s
    updateState(tabs){
        this.setState({
            currentTabs: tabs
        });
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
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
                    <CreateCategory onCreated={(name)=>this.saveCurrentTabs(name)}/>
                </div>
            );
            },
        );

        let categories = new Array();

        Object.keys(this.props.moods).forEach((mood,index)=>{
            categories.push(<Dropdown.Item key={index} onClick={()=>this.saveCurrentTabs(mood)}>{mood}</Dropdown.Item>);
        })
        

        if (this.state.currentTabs.length > 0) {
            // Return the current tabs panel
            return <section className="kt kt-panel kt-panel-current">
                <h2><span>Current Tabs</span> <span className="badge badge-secondary">{this.state.currentTabs.length}</span></h2>
                <TabGroup context="current" filter={this.props.filter} tabs={this.state.currentTabs}/>

                <Dropdown as={ButtonGroup}>
                    <Button variant="primary" onClick={() => this.saveCurrentTabs("main")}>Save</Button>

                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                    <Dropdown.Menu as={CustomMenu}>
                        {categories}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        } else {
            return <section className="kt kt-panel kt-panel-current kt-panel-current-empty">
                <p>There is no tab openned</p>
                <small>You can choose among the saved one or click on Open All to restore an older browsing session</small>
            </section>
        }
    }
}