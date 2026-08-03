import React from "react";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import Chip from "../../../components/element/chip.jsx";
import './alias-editor.css'


export class AliasEditor extends React.Component {
    constructor(props) {
        super(props);

        this.key = this.props.alias[0];
        this.values = this.props.alias[1].value.join();
        this.description = "";

        let savedDescription = this.props.alias[1].description;
        let empty = new RegExp(" *");
        if (savedDescription
            && savedDescription.split(empty).join().length > 0) {
            this.description = savedDescription;
        }

        this.state = {
            edited: false,
            editingValues: false,
            editingDesc: false,
            key: this.key,
            values: this.values,
            description: this.description
        };
        this.onEditKey = this.onEditKey.bind(this);
        this.onEditValues = this.onEditValues.bind(this);
        this.onEditDescription = this.onEditDescription.bind(this);

        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    /**
     * When an alias key is edited
     * @param {*} value 
     */
    onEditKey(value) {
        this.setState({ edited: true, key: value });
    }

    /**
     * When an alias values are edited
     * @param {*} event 
     */
    onEditValues(event) {
        this.setState({ edited: true, values: event.target.value });
    }

    /**
     * When an alias description is edited
     * @param {*} event 
     */
    onEditDescription(event) {
        this.setState({ edited: true, description: event.target.value });
    }

    /**
     * When values are edited
     * @param {*} isEditingValues 
     */
    setEditingValues(isEditingValues) {
        this.setState({ editingValues: isEditingValues })
    }

    /**
     * When description is edited
     * @param {*} isEditingDesc 
     */
    setEditingDescription(isEditingDesc) {
        this.setState({ editingDesc: isEditingDesc })
    }

    /**
     * Action to perform when changes are saved
     */
    onSave() {
        let alias = {}
        alias[this.state.key] = {
            values: this.state.values,
            description: this.state.description
        };

        this.props.onEdit(alias);

        this.key = this.state.key;
        this.values = this.state.values;
        this.description = this.state.description;

        this.setState({ edited: false });
    }

    /**
     * Action to perform when changes are canceled
     */
    onCancel() {
        this.setState({
            edited: false,
            editingValues: false,
            editingDesc: false,
            key: this.key,
            values: this.values
        });
    }

    render() {
        let description = (this.description == "") ?
            "Description here..." : this.state.description;

        return (
            <ListGroupItem className="kt kt-component kt-alias-editor">
                <div className="kt kt-alias-name">
                    <Chip onEdit={this.onEditKey}>{this.state.key}</Chip>
                    {!this.state.editingDesc &&
                        <span onDoubleClick={() => this.setEditingDescription(true)}
                            className="description">{description}</span>}
                    {this.state.editingDesc &&
                        <FormControl
                            onBlur={() => this.setEditingDescription(false)}
                            value={this.state.description}
                            onInput={this.onEditDescription}>
                        </FormControl>}
                </div>

                {!this.state.editingValues &&
                    <span onDoubleClick={() => this.setEditingValues(true)}
                        className="kt kt-alias-value">
                        {this.state.values}</span>
                }
                {this.state.editingValues &&
                    <FormControl onBlur={() => this.setEditingValues(false)}
                        value={this.state.values} onInput={this.onEditValues}></FormControl>
                }


                {this.state.edited && <Button variant="outline-danger" onClick={this.onCancel}>Cancel</Button>}
                {this.state.edited && <Button onClick={this.onSave}>Save</Button>}
            </ListGroupItem>
        );
    }
}