import React from "react";
import { ListGroupItem, Button, FormControl, CloseButton } from "react-bootstrap";
import Chip from "../../../components/element/chip/chip.jsx";
import './alias-editor.css'
import { Services } from "../../../services.jsx";


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

        this.renameAlias = this.renameAlias.bind(this);
        this.onDelete = this.onDelete.bind(this);
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
     * Rename the alias
     * @param {string} name Name of the alias
     */
    renameAlias(name) {
        Services.data.renameAlias(this.key, name);
        this.refresh();
    }

    /**
     * When values are edited
     * @param {*} isEditingValues 
     */
    setEditingValues(isEditingValues) {
        if (this.state.editingValues) {
            Services.data.setValuesForAlias(this.key, this.state.values.split(","));
            this.refresh();
        }

        this.setState({ editingValues: isEditingValues })
    }

    /**
     * When description is edited
     * @param {*} isEditingDesc 
     */
    setEditingDescription(isEditingDesc) {
        if (this.state.editingDesc) {
            Services.data.setDescriptionForAlias(this.key, this.state.description);
            this.refresh();
        }

        this.setState({ editingDesc: isEditingDesc });
    }

    /**
     * Refresh aliases based on what as been saved
     */
    refresh() {
        this.props.refresh();
    }


    /**
     * Action to perform when deleting the alias
     */
    onDelete() {
        this.props.onDelete();
    }

    render() {
        let description = (this.state.description == "") ?
            "Description here..." : this.state.description;

        let values = (this.state.values == "") ?
            "example.com" : this.state.values;

        return (
            <ListGroupItem className="kt kt-component kt-alias-editor">
                <div className="editor">
                    <div className="kt kt-alias-name">
                        <Chip
                            onBlur={this.renameAlias}
                            onEdit={this.onEditKey}
                        >{this.state.key}</Chip>
                        {!this.state.editingDesc &&
                            <div onClick={() => this.setEditingDescription(true)}
                                className="description">{description}</div>}
                        {this.state.editingDesc &&
                            <FormControl
                                autoFocus
                                onBlur={() => this.setEditingDescription(false)}
                                value={this.state.description}
                                onInput={this.onEditDescription}>
                            </FormControl>}
                    </div>

                    {!this.state.editingValues &&
                        <div onClick={() => this.setEditingValues(true)}
                            className="kt kt-alias-value">
                            {values}</div>
                    }
                    {this.state.editingValues &&
                        <FormControl
                            autoFocus
                            onBlur={() => this.setEditingValues(false)}
                            value={this.state.values}
                            onInput={this.onEditValues}></FormControl>
                    }
                </div>
                <CloseButton onClick={this.onDelete}></CloseButton>
            </ListGroupItem>
        );
    }
}