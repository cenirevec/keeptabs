import React, {useState} from "react";
import { webexVersion } from "../../../public/api/shared.variables.mjs";
import { Button, ListGroup, ListGroupItem, Offcanvas } from "react-bootstrap";
import { Services } from "../../services.jsx"

export function SettingsPanel() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileUpload = (event) =>{
      var file = event.target.files[0]; // Get the first file selected

      var reader = new FileReader(); // Create a FileReader object
    
      reader.onload = function(e) {
        try {
          var content = JSON.parse(e.target.result);

          Services.data.upload(content);
        } catch (error) {
          console.error(error,"JSON file cannot be parsed");
        }
      };
    
      reader.readAsText(file); 
    }
  
    return (
      <>
        <Button id="settings-btn" variant="outline-primary" onClick={handleShow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                        </svg>
                        Settings
        </Button>
  
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Settings</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h5>Storage</h5>
            <ListGroup>
              <ListGroup>
                <ListGroupItem action >
                  Import data 
                  <input type="file" accept=".json" onChange={handleFileUpload}></input>
                  <small>Importation succeded</small>
                  <small>Importation failed</small>
                  <small>Importation 36%</small>
                  </ListGroupItem>
                <ListGroupItem action onClick={Services.data.download}>
                  Export data</ListGroupItem>
              </ListGroup>

              <br></br>
              <ListGroup>
                <ListGroupItem variant="danger" action onClick={()=>{
                  Services.data.clear();
                  //@todo Add confirmation modal
                  location.reload();
                }}>Clear all data</ListGroupItem>
              </ListGroup>
            </ListGroup>
            <br></br>
           {/*  <h5>Performances</h5>
            <ListGroup>
              <ListGroupItem>Load all tabs at a same time <b>OFF</b></ListGroupItem>
              <ListGroupItem variant="info">Enable this function will enable an algorithm to manage website overload</ListGroupItem>
            </ListGroup> */}

            <h5>Development tools</h5>
            <ListGroup>
             {/*  <Button variant="outline-danger">Remove a Tab</Button> */}
              {/* <Button variant="secondary">Refresh</Button> */}
              <ListGroupItem>Refresh</ListGroupItem>
              <ListGroupItem action onClick={()=>{console.log(Services)}}> Get Services</ListGroupItem>
              <ListGroupItem action onClick={()=>{console.log(Services.data.model)}}> Get Data model</ListGroupItem>
              <ListGroupItem action onClick={()=>{console.log(Services.data.model.categories)}}> Get Data model categories</ListGroupItem>
            </ListGroup>

            <small id="manifest-version" className="text text-secondary">version {webexVersion} (dev)</small>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }