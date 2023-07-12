import React from "react";
import { Button, ButtonGroup, ListGroup, ListGroupItem, OverlayTrigger, Popover } from "react-bootstrap";
import { Renamable } from "../shared/renamable/renamable.jsx";
import { SettingOption } from "./settingOption.jsx";
import { Services } from "../../services.jsx";

export class CategoryMenu extends React.Component{
    constructor(props){
        super(props)
    }

    getPopover(){
        return <Popover className="kt-popover-menu" id="category-popover">
        <Popover.Header as="h3">
            <Renamable value={this.props.category.meta.name} 
                           onSubmit={(newName)=>{
                            if(this.props.renameItem){
                                this.props.renameItem(this.props.category,newName)
                            }
                           }}
                ></Renamable>
        </Popover.Header>
        <Popover.Body>

          <b>Auto-deletion</b>
          <ListGroup className="withSettings">
            <ListGroupItem>
                <SettingOption type="duration"
                    min="0"
                    step="1"
                    allowedUnits="dwM"
                    unit="day"
                    >
                    Hide tabs after
                </SettingOption>
            </ListGroupItem>
            <ListGroupItem>
                <SettingOption type="duration"
                    min="0"
                    step="1"
                    allowedUnits="dwM"
                    unit="day"
                    >
                    Delete tabs after
                </SettingOption>
            </ListGroupItem>
          </ListGroup>
          <br></br>
          <ListGroup>
            <ListGroupItem variant="danger" action onClick={()=>{
                Services.category.delete(this.props.categoryId);
                //@todo Add confirmation modal
                Services.main?.refresh();}}
            >Remove {this.props.category.meta.name}</ListGroupItem>
          </ListGroup>
        </Popover.Body>
      </Popover>
    }

    render(){
        return <OverlayTrigger trigger="click" rootClose  placement="bottom" overlay={this.getPopover()}>
          <Button className="category-popover-icon" variant="link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
          </Button>
        </OverlayTrigger>
    }
}