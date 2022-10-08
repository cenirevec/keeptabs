import React from "react";
import { Button } from "react-bootstrap";
import { TabService } from "../../../public/api/services/oldServices/tab.service.mjs";
import { TabGroup } from "./tabGroup.jsx";

export class MoodGroup extends React.Component{  

    length = 0;

        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        
        this.state = {
            tabGroups: this.props.tabGroups
        };
        this.removeTabGroup = this.removeTabGroup.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }
    
    /**
     * .Update tab groups
     */
    onUpdate(){
        this.props.onUpdate(this.props.tabGroups);
        
    }

    /**
     * Remove the tab group
     * @param {number} tabGroupId Id of the tab group
     */
    removeTabGroup(tabGroupId){
        this.props.tabGroups.splice(tabGroupId,1);
        this.props.saveData();
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        if (this.props.tabGroups == undefined)
            return;
            
        //Create the tab group list
        let tabgroupList = this.props.tabGroups.map(
            (tabGroup,index)=> 
            <TabGroup key={index} 
                      id={index} 
                      category={this.props.name} 
                      onUpdate={this.onUpdate}
                      deleteFunction={()=>{this.removeTabGroup(index)}}
                      filter={this.props.filter}
                      tabs={tabGroup} context="saved"/>);

        this.length = 0;
        this.props.tabGroups.forEach(tabGroup => {
            this.length += tabGroup.length;
        });
        //console.log(this.props.name,this.props.tabGroups.length,JSON.parse(JSON.stringify(this.props.tabGroups)).length)
        
        return <div className="kt kt-component kt-component-moodgroup row">
                    {this.props.tabGroups.length > 0 && tabgroupList}
                    {this.props.tabGroups.length == 0 && 
                        <div className="empty col-lg-6">
                            <p>There is no tab saved in {this.props.name}</p>
                            <small>You can add the current tabs by clicking on the <Button className="disabled">Save</Button> button</small>
                        </div>
                    }
                </div>
    }   
}