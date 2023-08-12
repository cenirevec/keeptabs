import React, {useState} from "react";
import { webexVersion } from "../../../public/api/shared.variables.mjs";
import { Accordion, Button, ListGroup, ListGroupItem, Offcanvas } from "react-bootstrap";
import { Services } from "../../services.jsx"
import AccordionItem from "react-bootstrap/esm/AccordionItem.js";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { SettingOption } from "../element/settingOption.jsx";
import { LoadingMode } from "../../../public/api/defaultData.mjs";
import ConfirmationModal from "../element/confirmationModal.jsx";

export function SettingsPanel() {
    const [show, setShow] = useState(false);

    const options = [
        { name: 'Differed', value: LoadingMode.DIFFERED },
        { name: 'Lazy', value: LoadingMode.LAZY }
    ];
  
    const handleClose = () => {
      setShow(false);
      
      // Save the settings data
      Services.data.save();
    };
    const handleShow = () => setShow(true);

    const onOptionUpdate = (source,optionToChange,value) => {
      source[optionToChange] = value;
    }

    const handleFileUpload = (result,file) =>{
          /**
           * Function to acknowledge import progression
           * @param {ProgressionStatus} status Importation status
           */
          const onProgress = (status)=>{
            console.log(status)
          }

          Services.data.upload(result,onProgress);
          Services.main.refresh();
    }

    let tabOptions = Services.data.model?.meta?.settings?.loading;

    return (
      <>
        <Button id="settings-btn" variant="outline-primary" onClick={handleShow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                        </svg>
                        Settings
        </Button>
        
      
        <Offcanvas className="settings" show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Settings</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>

            <h5>Tabs</h5>
            <ListGroup>
              <ListGroupItem>
                <SettingOption type="options" 
                  value={tabOptions?.mode} 
                  onChange={(value)=>{onOptionUpdate(tabOptions,"mode",value)}}
                  options={options}> Loading mode </SettingOption>
              </ListGroupItem>
              <ListGroupItem>
                <SettingOption type="number" 
                  value={tabOptions?.interval} 
                  onChange={(value)=>{onOptionUpdate(tabOptions,"interval",value)}}
                  min="0" max="1000" step="25"> 
                  Time before loading the next tab in ms 
                </SettingOption>
              </ListGroupItem>
              <ListGroupItem>
                <SettingOption type="checkbox" 
                  value={tabOptions?.makeOpenedTabActive} 
                  onChange={(value)=>{onOptionUpdate(tabOptions,"makeOpenedTabActive",value)}}
                  > Make last opened tab active </SettingOption>
              </ListGroupItem>
            </ListGroup>
            <br></br>
            <h5>Storage</h5>
            <ListGroup>
              <ListGroup>
                <ListGroupItem action >
                  <SettingOption type="upload" onUpload={handleFileUpload}> Import data </SettingOption>
                </ListGroupItem>
                <ListGroupItem action onClick={Services.data.download}>
                  Export data</ListGroupItem>
              </ListGroup>

              <br></br>
              <ListGroup>
                <ListGroupItem variant="danger" action onClick={()=>{
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
                    <ListGroupItem action onClick={()=>{Services.main?.refresh()}}>Refresh</ListGroupItem>
                    <ListGroupItem action onClick={()=>{console.log(Services)}}> Get Services</ListGroupItem>
                    <ListGroupItem action onClick={()=>{console.log(Services.data.model)}}> Get Data model</ListGroupItem>
                    <ListGroupItem action onClick={()=>{console.log(Services.data.model.categories)}}> Get Data model categories</ListGroupItem>
                  </ListGroup>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
            


          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }