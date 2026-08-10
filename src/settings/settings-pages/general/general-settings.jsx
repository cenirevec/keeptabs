import React from "react";
import { Accordion, ListGroup, ListGroupItem, Offcanvas } from "react-bootstrap";
import { Services } from "../../../services.jsx"
import AccordionItem from "react-bootstrap/esm/AccordionItem.js";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { SettingOption } from "../../../components/element/settingOption/settingOption.jsx";
import { LoadingMode } from "../../../../public/api/defaultData.mjs";

export class GeneralSettings extends React.Component {


  options = [
    { name: 'Differed', value: LoadingMode.DIFFERED },
    { name: 'Lazy', value: LoadingMode.LAZY }
  ];

  savedOptions = {
    tabs: Services.data.model?.meta?.settings?.loading
  }


  constructor(props) {
    super(props);
  }

  /**
   * Read data from model
   */
  componentDidUpdate() {
    this.savedOptions = {
      tabs: Services.data.model?.meta?.settings?.loading
    }
  }

  /**
   * Save on unmount
   */
  componentWillUnmount() {
    // Save the settings data
    Services.data.save();
  }

  /**
   * Action to do when a file is uploaded
   * @param {*} result 
   * @param {*} file 
   */
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

  /**
   * Action triggered when an option is changed
   * @param {*} source 
   * @param {*} optionToChange 
   * @param {*} value 
   */
  onOptionUpdate(source, optionToChange, value) {
    source[optionToChange] = value;
  }

  render() {
    return (
      <>
        <h4>General Settings</h4>
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

              location.reload();

            }}>Clear all data</ListGroupItem>
          </ListGroup>
        </ListGroup>


        <small id="manifest-version" className="text text-secondary">version {Services.data?.webexManifest?.version} (dev)</small>
      </>
    );
  }
}