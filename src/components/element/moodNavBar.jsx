import React,{Component} from "react";
import { Nav, Badge, Button } from 'react-bootstrap';
import { CreateCategory } from "./createCategory.jsx";
import { Renamable } from "../shared/renamable/renamable.jsx";

class EditionInProgress{
  status = true;
  rename = null;
}

class item{
  id = -1;
  value = null;
}

/**
 * Tabs navigation bar
 */
export class MoodNavBar extends Component{

        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        

        this.state = {
            moodLengths: this.props.moodLengths,  //Defines the number of tabs on each category 
            selected: this.props.selected,  //Defines the name of the selected category 
            edition: new EditionInProgress()
        };
        //Function bindings
        this.createCategory = this.createCategory.bind(this);
        this.renameItem = this.renameItem.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
    }

    /**
     * Select which category to show
     * @param {number} index 
     */
    selectCategory(index){
        this.props.selectCategory(index);
    }

    /**
     * Create a category
     * @param {string} name Name of the category
     */
    createCategory(name){
      //@todo
      //this.props.addMood(name);
      console.log(name)
    }

    /**
     * Rename the item
     * @param {*} category Category to rename
     * @param {*} newName Name to give
     */
    renameItem(category,newName){
      category.meta.name = newName;
      this.props.saveData();
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
      if(this.props.data == undefined ||
        this.props.data.categories == undefined || 
        this.props.data.length == 0)
        return;

      let navbarItems = [];
      
      Object.keys(this.props.data.categories).forEach(index=>{
        const category = this.props.data.categories[index];
        const categoryName = category.meta.name;
        const length = getCategorySize(category);

        navbarItems.push(
          <Nav.Item key={index} 
                    onClick={() => {this.selectCategory(index)}} 
                    onDoubleClick={()=>{this.renameItem(index)}}>
            <Nav.Link eventKey={index}>
              <span className="mood-name">
                <Renamable value={categoryName} onSubmit={(newName)=>this.renameItem(category,newName)}></Renamable>
              </span>
              {index == this.props.selected 
              &&   <Badge pill bg="light" text="primary" className="selected"> {length} </Badge>}
              {index != this.props.selected 
              &&   <Badge pill> {length} </Badge>}
            </Nav.Link>
          </Nav.Item>
        );
      })

      return <Nav className="kt kt-component kt-component-mood-navbar" variant="pills" defaultActiveKey={this.props.selected}>
        {navbarItems}
        <Nav.Item>
          <CreateCategory saveData={this.props.saveData} onCreated={this.createCategory}/>
        </Nav.Item>
      </Nav>
    }
}

export default MoodNavBar;

/**
 * Get the number of tabs in a category
 * @param {*} category 
 * @returns 
 */
export function getCategorySize(category){
  let length = 0;
  
  category.tabGroups.forEach(tabGroup=>{
    length += tabGroup.tabs.length;
  });
  return length;
}