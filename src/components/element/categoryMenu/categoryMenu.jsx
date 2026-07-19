import React from "react";
import { Button, ListGroup, ListGroupItem, OverlayTrigger, Popover } from "react-bootstrap";
import { Renamable } from "../../shared/renamable/renamable.jsx";
import { SettingOption } from "../settingOption/settingOption.jsx";
import { Services } from "../../../services.jsx";
import ConfirmationModal from "../confirmationModal.jsx";
import './categoryMenu.css';

export class CategoryMenu extends React.Component{
  
    constructor(props){
        super(props);

        this.state = {
          showModal: false
        }

        this.handleRemoveModalAction = this.handleRemoveModalAction.bind(this);
    }

    handleRemoveModalAction(actionName){
      if(this.props.category.meta?.translationLabel == "categories.names.temporary"){
        this.setState({showModal:false})
        return;
      }

      if(actionName == "confirm"){
        Services.category.delete(this.props.categoryId);

        if(parseInt(this.props.selected) == parseInt(this.props.categoryId)){
          Services.main?.setSelectedCategory(this.props.categoryId - 1);
        }
        Services.main?.refresh();
      }
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
                    value={this.props.category.meta.hidden}
                    min="0"
                    step="1"
                    allowedUnits="dwM"
                    unit="day"
                    id="hidden"
                    >
                    Hide tabs after
                </SettingOption>
            </ListGroupItem>
            <ListGroupItem>
                <SettingOption type="duration"
                    value={this.props.category.meta.expiration}
                    min="0"
                    step="1"
                    allowedUnits="dwM"
                    unit="day"
                    id="expiration"
                    >
                    Delete tabs after
                </SettingOption>
            </ListGroupItem>
          </ListGroup>
          {this.props.category.meta.translationLabel != "categories.names.temporary" && <ListGroup>
            <ListGroupItem id="remove-category" variant="danger" action onClick={()=>{
                this.setState({showModal: true});}}
            >Remove {this.props.category.meta.name}</ListGroupItem>
          </ListGroup>}
        </Popover.Body>
      </Popover>
    }

    render(){
        return <>
          <OverlayTrigger trigger="click" rootClose  placement="bottom" overlay={this.getPopover()}>
            <Button className="category-popover-icon" variant="link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
            </Button>
          </OverlayTrigger>
          <ConfirmationModal 
            show={this.state.showModal} 
            onClose={()=>{this.setState({showModal:false})}}
            onAction={this.handleRemoveModalAction}
            >
              {
                this.props.category.meta?.translationLabel == "categories.names.temporary" ?
                `You cannot remove the temporary category`:
                `Do you really want to remove ${this.props.category.meta.name}`
              }
            </ConfirmationModal>
        </>
    }
}