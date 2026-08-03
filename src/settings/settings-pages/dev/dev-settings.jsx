import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Services } from "../../../services.jsx"

export class DeveloperSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <>
                <h4>Developer Settings</h4>
                <ListGroup>
                    <ListGroupItem><small><i>Instance UID: {Services.background.instanceId}</i></small></ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.main?.refresh() }}>Refresh</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services) }}> Get Services</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services.data.model) }}> Get Data model</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services.data.model.categories) }}> Get Data model categories</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services.data.model.meta.shortcuts) }}> Get Aliases</ListGroupItem>
                  </ListGroup>

                  <h5>Communcation</h5>
                  <ListGroup>
                    <ListGroupItem action onClick={() => { Services.background.subscribe(); console.log('Ping done!') }}>Ping the server</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.checkInstance() }}>Check the instance</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.getMap().then(console.log) }}>Get map</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.reloadOtherInstances() }}>Reload instances</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.log("info","Hello world!") }}>Say Hello to the world</ListGroupItem>
                  </ListGroup>
                        
            </>
        )
    }
}