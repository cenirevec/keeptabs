import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { TabGroup } from "./tabGroup.jsx";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { Services } from "../../services.jsx";

export class MoodGroup extends React.Component{  
    /**
     * Number of elements
     */
    length = 0;

    /**
     * Number of hidden elements
     */
    hiddenElements = 0;

        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        
        this.state = {
            tabGroups: this.props.category.tabGroups
        };
        this.removeTabGroup = this.removeTabGroup.bind(this);
    }

    /**
     * Remove the tab group
     * @param {number} tabGroupId Id of the tab group
     */
    removeTabGroup(tabGroupId){
        this.props.category.tabGroups.splice(tabGroupId,1);
        this.props.saveData();
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        if (this.props.category.tabGroups == undefined)
            return;

        //Set default hidden date
        if(!this.props.category.meta.hasOwnProperty("hidden")){
            this.props.category.meta.hidden = 1000*60*60*24*31;
            Services.data.save();
        }

        //Set default expiration date
        if(!this.props.category.meta.hasOwnProperty("expiration")){
            this.props.category.meta.expiration = 1000*60*60*24*165;
            Services.data.save();
        }

        // Check if the tab has to be hidden
        let checkHidden = (tabGroup)=>{
            if(!this.props.category.meta.hidden) return false;

            return (Date.now() - tabGroup.meta.lastAccessed) > this.props.category.meta.hidden;
        }

        //Withdraw the empty tabGroups
        this.props.category.tabGroups = 
            this.props.category.tabGroups.filter((tabGroup)=> tabGroup.tabs.length > 0);

        //Delete expired tab groups
        if(this.props.category.meta.expiration){
            this.props.category.tabGroups = 
                this.props.category.tabGroups.filter((tabGroup)=>
                    (Date.now() - tabGroup.meta.lastAccessed) <= this.props.category.meta.expiration);
            Services.data.save();
        }

        //Create the list of visible tab groups
        let tabgroupList = this.props.category.tabGroups.filter((tabGroup)=>!checkHidden(tabGroup)).map(
            (tabGroup,index)=> 
            <TabGroup key={index} 
                      id={index} 
                      category={this.props.category.meta.name} 
                      saveData={this.props.saveData}
                      onUpdate={this.props.onUpdate}
                      deleteFunction={()=>{this.removeTabGroup(index)}}
                      filter={this.props.filter}
                      tabGroup={tabGroup} context="saved"/>);

        //Create the list of hidden tab groups
        // This part can be loaded on demand if the performances doesn't increase
        let hiddenTabgroupList = this.props.category.tabGroups.filter(checkHidden).map(
            (tabGroup,index)=> 
            <TabGroup key={index} 
                      id={index} 
                      category={this.props.category.meta.name} 
                      saveData={this.props.saveData}
                      onUpdate={this.props.onUpdate}
                      deleteFunction={()=>{this.removeTabGroup(index)}}
                      filter={this.props.filter}
                      tabGroup={tabGroup} context="saved"/>);


        this.length = 0;
        this.hiddenElements = 0;
        this.props.category.tabGroups.forEach(tabGroup => {
            this.length += tabGroup.tabs.length;
            if(checkHidden(tabGroup)){
                this.hiddenElements += tabGroup.tabs.length;
            }
        });
        
        return <div className="kt kt-component kt-component-moodgroup row">
                    {tabgroupList.length > 0 && tabgroupList}
                    {this.props.category.tabGroups.length == 0 && 
                        <div className="empty col-lg-6">
                            <p>There is no tab saved in {this.props.category.meta.name}</p>
                            <small>You can add the current tabs by clicking on the <Button className="disabled">Save</Button> button</small>
                        </div>
                    }
                    { hiddenTabgroupList.length > 0 &&
                        <Accordion>
                            <AccordionHeader>
                                Show the {this.hiddenElements} hidden elements</AccordionHeader>
                            <AccordionBody className="row">
                                {hiddenTabgroupList}</AccordionBody>
                        </Accordion>}
                </div>
    }   
}