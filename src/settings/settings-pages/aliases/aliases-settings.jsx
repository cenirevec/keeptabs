import React from "react";
import { Modal, Button, Table, ListGroup, ListGroupItem } from "react-bootstrap"

import { AliasEditor } from "../../setting-component/alias-editor/alias-editor.jsx";
import { Services } from "../../../services.jsx";
import Chip from "../../../components/element/chip.jsx";

export class AliasSettings extends React.Component {
    aliases = {};

    constructor(props) {
        super(props)


        // this.onAddAlias = this.onAddAlias.bind(this);
        this.addAlias = this.addAlias.bind(this);

        this.state = {
            aliases: Services.data.getAliases()
        }
    }

    /**
     * Action to do when the componenent is mounted
     */
    componentDidMount() {
        this.setState({
            aliases: Services.data.getAliases()
        })
    }

    /**
     * Actions to do to to refresh the pane
     */
    refresh() {
        this.setState({
            aliases: Services.data.getAliases()
        })
    }

    /**
     * Add an alias
     */
    addAlias() {
        let withAlias = Object.assign(this.state.aliases);
        withAlias["yourAlias"] = { value: ["example.com"] };

        this.setState({
            aliases: withAlias
        })
    }

    /**
     * Actions to do when changes are saved
     * @param {*} oldAlias Previous name of the alias
     * @param {*} newAlias New name of the alias
     */
    onSave(oldAlias, newAlias) {
        let oldKey = oldAlias[0];
        let newKey = Object.keys(newAlias)[0];
        let values = newAlias[newKey].values;
        let description = newAlias[newKey].description;

        Services.data.setValuesForAlias(oldKey, values.split(","));
        Services.data.setDescriptionForAlias(oldKey, description);
        Services.data.renameAlias(oldKey, newKey);
        this.refresh();
    }

    onDelete(alias){

    }

    import(){

    }

    export(){

    }

    /**
     * Compare two aliases based on the first letter
     * @param {*} alias1 
     * @param {*} alias2 
     * @returns 
     */
    compareAliases(alias1, alias2) {
        if (alias1[0] < alias2[0]) {
            return -1;
        } else if (alias1[0] > alias2[0]) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Render
     * @returns 
     */
    render() {
        
        let aliasesList = Object.entries(this.state.aliases).sort(this.compareAliases).map((alias, index) =>
            <AliasEditor key={index} alias={alias} onEdit={(newValue) => this.onSave(alias, newValue)}></AliasEditor>
        );

        return (
            <>
                <h4>Alias Settings</h4>
                <ListGroup>
                    {aliasesList}
                    <ListGroupItem onClick={this.addAlias}>+Add alias</ListGroupItem>
                </ListGroup>
                <div className="kt kt-alias-options">
                    <Button onClick={this.import}>Import</Button>
                    <Button onClick={this.export}>Export</Button>
                    <Button variant="danger">Clear</Button>
                </div>
            </>
        )
    }
}