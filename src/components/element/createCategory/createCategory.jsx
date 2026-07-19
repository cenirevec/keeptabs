import React, { Component } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Services } from "../../../services.jsx";
import './createCategory.css';

export class CreateCategory extends Component {

    category = ''

    defaultCategoryData = {
        "meta": {
            name: "newCategory",
            expiration: null,
            hidden: 2635200000 // a month
        },
        "tabGroups": []
    }

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
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
    createCategory(event) {
        event.preventDefault();

        let category = Services.category.create(this.state.name);
        if (this.props.onCreated) {
            this.props.onCreated(category);
        }
        this.toggleEditionMode(false);
        Services.main?.refresh();
    }

    setName(name) {
        this.setState({
            name: name
        })
    }

    /**
     * Set/Unset the Edition mode
     * @param {boolean} enabled Whether the mode is active or not
     */
    toggleEditionMode(enabled) {
        this.setState({
            edition: enabled
        });

        // if (!enabled) {
        //     this.setState({
        //         name: ''
        //     });
        // }

        if(enabled){
            setTimeout(()=>{
                let width = document.querySelector(".kt-component-mood-navbar").scrollWidth;
                document.querySelector(".kt-component-mood-navbar").scrollTo(width + 500,0);    

                document.querySelector(".form-control").value = "";
            },0);
        }
    }

    renderButtonWithInput() {
        return <React.Fragment>
            {!this.state.edition &&
                <Button className="kt kt-element kt-add-category-bttn" onClick={() => { this.toggleEditionMode(true) }}>
                    + Add category
                </Button>
            }
            {this.state.edition &&
                <Form className="kt kt-element kt-add-category-inputs" onSubmit={this.createCategory}>
                    <InputGroup>
                        <Form.Control placeholder="Add..."
                            aria-describedby="add-category-input"
                            value={this.state.name}
                            autoFocus
                            onChange={(e) => this.setName(e.target.value)}
                        ></Form.Control>
                        <Button onClick={this.createCategory}
                            id="add-category-input"
                        >Add</Button>
                    </InputGroup>
                </Form>
            }
        </React.Fragment>;
    }

    renderContextualButton() {
        return <Button><b>+ Add Tech</b></Button>
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        if (this.props == undefined)
            return;

        return this.renderButtonWithInput();
    }
}