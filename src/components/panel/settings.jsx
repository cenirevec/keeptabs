import React, { useState } from "react";
import { webexVersion } from "../../../public/api/shared.variables.mjs";
import { Accordion, Button, ListGroup, ListGroupItem, Offcanvas } from "react-bootstrap";
import { Services } from "../../services.jsx"
import AccordionItem from "react-bootstrap/esm/AccordionItem.js";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { SettingOption } from "../element/settingOption.jsx";
import { LoadingMode } from "../../../public/api/defaultData.mjs";
import ConfirmationModal from "../element/confirmationModal.jsx";
import { SearchAliasesModal } from "../modal/searchAliasesModal.jsx";

export class SettingsPanel extends React.Component {


  options = [
    { name: 'Differed', value: LoadingMode.DIFFERED },
    { name: 'Lazy', value: LoadingMode.LAZY }
  ];

  savedOptions = {
    tabs: Services.data.model?.meta?.settings?.loading
  }


  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.setShowAliasesModal = this.setShowAliasesModal.bind(this);

    this.state = {
      showAliasesModal: false
    }
  }

  componentDidUpdate() {
    this.savedOptions = {
      tabs: Services.data.model?.meta?.settings?.loading
    }
  }

  handleClose() {
    this.props.setShow(false);

    // Save the settings data
    Services.data.save();
  };

  handleShow() {
    this.props.setShow(true);
  }


  handleFileUpload(result, file) {
    /**
     * Function to acknowledge import progression
     * @param {ProgressionStatus} status Importation status
     */
    const onProgress = (status) => {
      console.log(status)
    }

    Services.data.upload(result, onProgress);
    Services.main.refresh();
  }

  onOptionUpdate(source, optionToChange, value) {
    source[optionToChange] = value;
  }


  setShowAliasesModal(value) {
    this.setState({
      showAliasesModal: value
    });
  }

  render() {
    //const [showAliasesModal, setShowAliasesModal] = useState(false);

    return (
      <>

        <Offcanvas className="settings" show={this.props.show} onHide={this.handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Settings</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>

            <h5>Tabs</h5>
            <ListGroup>
              <ListGroupItem>
                <SettingOption type="options"
                  value={this.savedOptions?.tabs?.mode}
                  onChange={(value) => { this.onOptionUpdate(this.savedOptions?.tabs, "mode", value) }}
                  options={this.options}> Loading mode </SettingOption>
              </ListGroupItem>
              <ListGroupItem>
                <SettingOption type="number"
                  value={this.savedOptions?.tabs?.interval}
                  onChange={(value) => { this.onOptionUpdate(this.savedOptions?.tabs, "interval", value) }}
                  min="0" max="1000" step="25">
                  Time before loading the next tab in ms
                </SettingOption>
              </ListGroupItem>
              <ListGroupItem>
                <SettingOption type="checkbox"
                  value={this.savedOptions?.tabs?.makeOpenedTabActive}
                  onChange={(value) => { this.onOptionUpdate(this.savedOptions?.tabs, "makeOpenedTabActive", value) }}
                > Make last opened tab active </SettingOption>
              </ListGroupItem>
            </ListGroup>
            <br></br>
            <h5>Searchbar</h5>
            <ListGroup>
              <ListGroupItem action onClick={() => this.setShowAliasesModal(true)}>
                Open search aliases panel
              </ListGroupItem>
              <SearchAliasesModal
                visible={this.state.showAliasesModal}
                setVisible={this.setShowAliasesModal}
              ></SearchAliasesModal>
            </ListGroup>
            <br></br>
            <h5>Storage</h5>
            <ListGroup>
              <ListGroup>
                <ListGroupItem action >
                  <SettingOption type="upload" onUpload={this.handleFileUpload}> Import data </SettingOption>
                </ListGroupItem>
                <ListGroupItem action onClick={Services.data.download}>
                  Export data</ListGroupItem>
              </ListGroup>

              <br></br>
              <ListGroup>
                <ListGroupItem variant="danger" action onClick={() => {
                  Services.data.clear();
                  //@todo Add confirmation modal
                  //Services.main?.refresh();
                  location.reload();

                }}>Clear all data</ListGroupItem>
              </ListGroup>
            </ListGroup>


            <small id="manifest-version" className="text text-secondary">version {webexVersion} (dev)</small>


            <Accordion>
              <AccordionItem>
                <AccordionHeader> <h5>Development tools</h5></AccordionHeader>
                <AccordionBody>
                  <ListGroup>
                    {/*  <Button variant="outline-danger">Remove a Tab</Button> */}
                    {/* <Button variant="secondary">Refresh</Button> */}
                    <ListGroupItem><small><i>Instance UID: {Services.background.instanceId}</i></small></ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.main?.refresh() }}>Refresh</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services) }}> Get Services</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services.data.model) }}> Get Data model</ListGroupItem>
                    <ListGroupItem action onClick={() => { console.log(Services.data.model.categories) }}> Get Data model categories</ListGroupItem>

                  </ListGroup>
                  <h5>Communcation</h5>
                  <ListGroup>
                    <ListGroupItem action onClick={() => { Services.background.subscribe(); console.log('Ping done!') }}>Ping the server</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.checkInstance() }}>Check the instance</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.getMap().then(console.log) }}>Get map</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.reloadOtherInstances() }}>Reload instances</ListGroupItem>
                    <ListGroupItem action onClick={() => { Services.background.log("info","Hello world!") }}>Say Hello to the world</ListGroupItem>
                  </ListGroup>
                </AccordionBody>
              </AccordionItem>
            </Accordion>



          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
}