import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Services } from "../../../services.jsx"
import { SettingOption } from "../../../components/element/settingOption/settingOption.jsx";
import { LoadingMode } from "../../../../public/api/defaultData.mjs";
import { t } from "i18next";

export class GeneralSettings extends React.Component {


  options = [
    { name: t("settings.general.loadingMode.differed"), value: LoadingMode.DIFFERED },
    { name: t("settings.general.loadingMode.lazy"), value: LoadingMode.LAZY }
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
    let path = "settings.general";
    return (
      <>
        <h4>{t(`${path}.description`)}</h4>
        <h5>{t("common.tabs")}</h5>
        <ListGroup>
          <ListGroupItem>
            <SettingOption type="options"
              value={this.savedOptions?.tabs?.mode}
              onChange={(value) => { this.onOptionUpdate(this.savedOptions?.tabs, "mode", value) }}
              options={this.options}> {t(`${path}.loadingMode.title`)}</SettingOption>
          </ListGroupItem>
          <ListGroupItem>
            <SettingOption type="number"
              value={this.savedOptions?.tabs?.interval}
              onChange={(value) => { this.onOptionUpdate(this.savedOptions?.tabs, "interval", value) }}
              min="0" max="1000" step="25">
              {t(`${path}.cadence`)}
            </SettingOption>
          </ListGroupItem>
          <ListGroupItem>
            <SettingOption type="checkbox"
              value={this.savedOptions?.tabs?.makeOpenedTabActive}
              onChange={(value) => { this.onOptionUpdate(this.savedOptions?.tabs, "makeOpenedTabActive", value) }}
            > {t(`${path}.autofocus`)} </SettingOption>
          </ListGroupItem>
        </ListGroup>
        <br></br>
        <h5>{t(`${path}.storage.title`)}</h5>
        <ListGroup>
          <ListGroup>
            <ListGroupItem action >
              <SettingOption type="upload" onUpload={this.handleFileUpload}> {t(`${path}.storage.import`)} </SettingOption>
            </ListGroupItem>
            <ListGroupItem action onClick={Services.data.download}>
             {t(`${path}.storage.export`)}</ListGroupItem>
          </ListGroup>

          <br></br>
          <ListGroup>
            <ListGroupItem variant="danger" action onClick={() => {
              Services.data.clear();

              location.reload();

            }}>{t(`${path}.storage.clear`)}</ListGroupItem>
          </ListGroup>
        </ListGroup>


        <small id="manifest-version" className="text text-secondary">version {Services.data?.webexManifest?.version} (dev)</small>
      </>
    );
  }
}