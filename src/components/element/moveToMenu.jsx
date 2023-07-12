import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { Renamable } from "../shared/renamable/renamable.jsx";
import { CategoryList } from "./categoryList.jsx";
import { Services } from "../../services.jsx";

export class MoveToMenu extends React.Component{
    constructor(props){
        super(props)

        this.moveTo = this.moveTo.bind(this);
    }

    moveTo(item){
      let sourceCategory = this.props.category;
      let oldCategoryIndex = sourceCategory.tabGroups.findIndex(tabGroup=>tabGroup == this.props.tabGroup);
      item.category.tabGroups.unshift(this.props.tabGroup);

      sourceCategory.tabGroups.splice(oldCategoryIndex,1);
      
      Services.data.save();
      location.reload();
    }

    getPopover(){
        return <Popover className="kt-popover-menu" id="category-popover">
        <Popover.Header as="h3">
            <Renamable value={this.props.category?.meta?.name} 
                           onSubmit={(newName)=>{
                            if(this.props.renameItem){
                                this.props.renameItem(this.props.category,newName)
                            }
                           }}
                ></Renamable>
        </Popover.Header>
        <Popover.Body>
          <CategoryList onSelect={this.moveTo}></CategoryList>
        </Popover.Body>
      </Popover>
    }

    render(){
        return <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.getPopover()}>
          <Button className="category-popover-icon" variant="primary">
            Move To
          </Button>
        </OverlayTrigger>
    }
}