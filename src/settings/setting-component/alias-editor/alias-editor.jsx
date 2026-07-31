import React from "react";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import Chip from "../../../components/element/chip.jsx";
import './alias-editor.css'


export class AliasEditor extends React.Component {
    constructor(props) {
        super(props);

        this.key = this.props.alias[0];
        this.values = this.props.alias[1].value.join();

        this.state = {
            edited: false,
            editingValues: false,
            key: this.key,
            values: this.values
        };
        this.onEditKey = this.onEditKey.bind(this);
        this.onEditValues = this.onEditValues.bind(this);

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
     * When values are edited
     * @param {*} isEditingValues 
     */
    setEditingValues(isEditingValues) {
        this.setState({ editingValues: isEditingValues })
    }

    /**
     * Action to perform when changes are saved
     */
    onSave() {
        let alias = {}
        alias[this.state.key] = this.state.values;

        this.props.onEdit(alias);

        this.key = this.state.key;
        this.values = this.state.values;

        this.setState({ edited: false });
    }

    /**
     * Action to perform when changes are canceled
     */
    onCancel() {
        this.setState({
            edited: false,
            editingValues: false,
            key: this.key,
            values: this.values
        });
    }

    render() {
        return (
            <ListGroupItem className="kt kt-component kt-alias-editor">
                <Chip onEdit={this.onEditKey}>{this.state.key}</Chip>

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