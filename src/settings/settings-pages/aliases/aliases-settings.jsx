import React from "react";
import { Modal, Button, Table, ListGroup, ListGroupItem, ButtonGroup } from "react-bootstrap"

import { AliasEditor } from "../../setting-component/alias-editor/alias-editor.jsx";
import { Services } from "../../../services.jsx";
import Chip from "../../../components/element/chip/chip.jsx";
import "./alias-settings.css";

export class AliasSettings extends React.Component {
    aliases = {};

    constructor(props) {
        super(props);

        // Binding function used by events
        this.addAlias = this.addAlias.bind(this);
        this.refresh = this.refresh.bind(this);

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
        Services.data.addAlias();
        this.refresh();
    }

    /**
     * Delete an alias by its name
     * @param {string} alias 
     */
    deleteAlias(alias) {
        Services.data.removeAlias(alias);
        this.refresh();
    }

    import() {
        
    }  

    export() {
        console.log(Services.data.getAliases());
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
            <AliasEditor
                key={alias}
                alias={alias}
                onEdit={(newValue) => this.onSave(alias, newValue)}
                onDelete={()=>this.deleteAlias(alias[0])}
                refresh={this.refresh}
            ></AliasEditor>
        );

        return (
            <div className="kt kt-settings-pane kt-alias-settings">
                <h4>Alias Settings</h4>
                <ListGroup>
                    {aliasesList}
                    <ListGroupItem onClick={this.addAlias}>+Add alias</ListGroupItem>
                </ListGroup>
                {/* <div className="kt kt-alias-options">
                    <ButtonGroup>
                        <Button variant="outline-primary" onClick={this.import}>Import</Button>
                        <Button variant="outline-primary" onClick={this.export}>Export</Button>
                    </ButtonGroup>
                    <Button variant="danger">Clear</Button>
                </div> */}
            </div>
        )
    }
}