import React, { Component } from "react"
import { Modal, Button, Table } from "react-bootstrap"
import { Renamable } from "../shared/renamable/renamable.jsx";
import { Services } from "../../services.jsx";

export class SearchAliasesModal extends React.Component {

    aliases = {};

    constructor(props) {
        super(props)

        this.handleClose = this.handleClose.bind(this);

        this.onAddAlias = this.onAddAlias.bind(this);
        this.onAliasChange = this.onAliasChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);

        this.state = {
            aliases: Services.data.getAliases()
        }
    }

    componentDidMount() {
        this.aliases = Services.data.getAliases();
    }

    refresh() {
        this.setState({
            aliases: Services.data.getAliases()
        })
    }

    handleClose() {
        this.props.setVisible(false);
    }

    onAliasChange(alias, newAlias) {
        Services.data.renameAlias(alias, newAlias);
        this.refresh();
    }

    onValueChange(alias, value) {
        Services.data.setValuesForAlias(alias, value.split(","));
        this.refresh();
    }

    onAddAlias(alias){
        if(alias && alias.length === 0){
            if(Services.data.hasAlias(alias)){

            }else{
                if(alias[0] === ":"){
                    alias = alias.slice(1);
                }
                Services.data.addAlias(alias);
                setTimeout(()=>{
                    this.refresh();
                },0)
            }
        }
    }

    render() {

        let aliasesList = Object.keys(this.aliases).map((key, index) => {
            return <tr key={key}>
                <td>{index + 1}</td>
                <td>:<Renamable onSubmit={(newAlias) => this.onAliasChange(key, newAlias)}
                    value={key}></Renamable></td>
                <td><Renamable placeholder="Add filters..."
                    onSubmit={(newValue) => this.onValueChange(key, newValue)}
                    value={this.aliases[key].value.toLocaleString()}></Renamable></td>
            </tr>
        })

        return <Modal show={this.props.visible} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Aliases for searchbar</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Alias</th>
                            <th>Filter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aliasesList}
                        <tr key="newItem">
                            <td></td>
                            <td key="newAlias">:<Renamable value="" onSubmit={this.onAddAlias}
                                placeholder="Add an alias...">
                            </Renamable>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                    Close
                </Button>
                {/*                 <Button variant="primary" onClick={this.handleClose}>
                    Save Changes
                </Button> */}
            </Modal.Footer>
        </Modal>
    }
}