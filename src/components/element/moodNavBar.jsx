import React,{Component} from "react";
import { Nav, Badge, Button } from 'react-bootstrap';
import { CreateCategory } from "./createCategory.jsx";
import { Renamable } from "../shared/renamable.jsx";

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
            selectedMood: this.props.selectedMood,  //Defines the name of the selected category 
            edition: new EditionInProgress()
        };
        //Function bindings
        this.createCategory = this.createCategory.bind(this);
        this.renameItem = this.renameItem.bind(this);
    }

    /**
     * Select which category to show
     * @param {string} name 
     */
    selectMood(name){
        this.props.selectMood(name);
    }

    /**
     * Create a category
     * @param {string} name Name of the category
     */
    createCategory(name){
      this.props.addMood(name);
    }

    /**
     * 
     * @param {*} mood 
     */
    renameItem(index){
      this.setState({
        edition : Object.assign(this.state.edition,
          {rename:index})
      })
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){

      if(this.props.moods.length == 0)
        return;

      let navbarItems = [];
      
      Object.keys(this.props.moods).forEach((mood,index) => {
        let length = this.props.moodLengths[mood];

        navbarItems.push(
          <Nav.Item key={index} 
                    onClick={() => {this.selectMood(mood)}} 
                    onDoubleClick={()=>{this.renameItem(index)}}>
            <Nav.Link eventKey={mood}>
              <span className="mood-name">
                <Renamable value={mood} onSubmit={this.renameItem}></Renamable>
              </span>
              {mood == this.props.selectedMood 
              &&   <Badge pill bg="light" text="primary" className="selected"> {length} </Badge>}
              {mood != this.props.selectedMood 
              &&   <Badge pill> {length} </Badge>}
            </Nav.Link>
          </Nav.Item>
        );
      });

      return <Nav className="kt kt-component kt-component-mood-navbar" variant="pills" defaultActiveKey={this.props.selectedMood}>
        {navbarItems}
        <Nav.Item>
          <CreateCategory onCreated={this.createCategory}/>
        </Nav.Item>
      </Nav>
    }
}

export default MoodNavBar;