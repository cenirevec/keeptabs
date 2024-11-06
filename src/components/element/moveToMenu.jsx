import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { CategoryList } from "./categoryList.jsx";
import { Services } from "../../services.jsx";

export class MoveToMenu extends React.Component {
  constructor(props) {
    super(props)

    this.moveTo = this.moveTo.bind(this);
  }

  moveTo(item) {
    let sourceCategory = this.props.category;
    let oldCategoryIndex = sourceCategory.tabGroups.findIndex(tabGroup => tabGroup == this.props.tabGroup);

    if (this.props.filteredTabs.length > 0) {
      let tabGroupCopy = JSON.parse(JSON.stringify(this.props.tabGroup));
      tabGroupCopy.tabs = JSON.parse(JSON.stringify(this.props.filteredTabs));

      item.category.tabGroups.unshift(tabGroupCopy);
    }

    if (this.props.filteredTabs.length == this.props.tabGroup.tabs.length) {
      sourceCategory.tabGroups.splice(oldCategoryIndex, 1);
    } else {
      this.props.tabGroup.tabs = this.props.tabGroup.tabs
        .filter((tab) => this.props.filteredTabs.indexOf(tab) == -1)
    }

    Services.data.save();
    Services.main?.refresh();
  }

  getPopover() {
    return <Popover className="kt-popover-menu" id="category-popover">
      <Popover.Header as="h3">
        Move to...
      </Popover.Header>
      <Popover.Body>
        <CategoryList onSelect={this.moveTo}></CategoryList>
      </Popover.Body>
    </Popover>
  }

  render() {
    return <OverlayTrigger flip="false" trigger="click" rootClose placement="bottom" overlay={this.getPopover()}>
      <Button className="category-popover-icon" variant="primary">
        Move To
      </Button>
    </OverlayTrigger>
  }
}