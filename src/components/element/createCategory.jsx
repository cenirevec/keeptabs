import React, { Component } from "react";
import { Form , Button, InputGroup } from "react-bootstrap";
import DataService from "../../../public/api/services/data/data.service.mjs";

export class CreateCategory extends Component{  

    category = ''

    defaultCategoryData = {
        "meta":{
            name: "newCategory",
            expiration: null
        },
        "tabGroups":[]
    }
    
    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);

        this.state = {
            edition: false,
            name: ''
        }
        this.createCategory = this.createCategory.bind(this);
    }

    /**
     * Category to create
     * @param {*} event Event handler
     */
    createCategory(event){
        event.preventDefault();

        let category = null;
        let categories = DataService.model.categories;
        let newCategoryIndex = 0;

        for(let categoryIndex in categories){
            if(categories[categoryIndex].meta.name == this.state.name){
                category = categories[categoryIndex];
            }
            if(categoryIndex == newCategoryIndex){
                newCategoryIndex++;
            }
        }

        //Create the category and quit edition mode
        let createAndToggle = ()=>{
            const {onCreated} = this.props;
            if(onCreated)
                onCreated(category);

            this.toggleEditionMode(false);
        }

        //  Check that the category doesnt exists yet
        if(category == null){
            category = {...this.defaultCategoryData};
            category.meta.name = this.state.name;
            categories[newCategoryIndex] = category;

            this.props.saveData();
        }else{
            createAndToggle();
        }
    }

    setName(name){
        this.setState({
            name: name
        })
    }
  
    /**
     * Set/Unset the Edition mode
     * @param {boolean} enabled Whether the mode is active or not
     */
    toggleEditionMode(enabled){
        this.setState({
            edition: enabled
        });

        if(!enabled){
            this.setState({
                name: ''
            })
        }
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        if(this.props == undefined)
            return;        

        return <React.Fragment>
            { !this.state.edition &&
                <Button variant="outline-primary" onClick={()=>{this.toggleEditionMode(true)}}>
                    + Add category
                </Button>
            }
            { this.state.edition &&
                <Form onSubmit={this.createCategory}>
                    <InputGroup>
                        <Form.Control placeholder="Add..."
                                    aria-describedby="add-category-input"
                                    value={this.state.name}
                                    onChange={(e)=>this.setName(e.target.value)}
                        ></Form.Control>
                        <Button onClick={this.createCategory}
                                id="add-category-input"
                        >Add</Button>
                    </InputGroup>
                </Form>
            }
        </React.Fragment>;
    }
}