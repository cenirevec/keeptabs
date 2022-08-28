import React, {useState} from "react";
import { webexVersion } from "../../../public/api/shared.variables.mjs";
import { Accordion, Button, ListGroup, ListGroupItem, Offcanvas } from "react-bootstrap";
import AccordionItem from "react-bootstrap/esm/AccordionItem.js";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader.js";
import AccordionBody from "react-bootstrap/esm/AccordionBody.js";
import { TabService } from "../../../public/api/services/oldServices/tab.service.mjs";

/*
export class SettingsPanel extends Component{  
    /**
     * React rendering function
     * @returns Rendered content
     *
    render(){
        return <React.Fragment>
            <div className="offcanvas-header">
                <h4 id="offcanvasRightLabel">Settings</h4>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <h5>Storage</h5>
                <ul className="list-group">
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            {1}
                        </div>
                    </div>
                
                    <button className="list-group-item btn btn-primary" id="exportData">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/>
                            <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                        Export data</button>
                </ul>
                <h5>Performances</h5>
                <ul className="list-group">
                    <li className="list-group-item">Load all tabs at a same time <b>OFF</b></li>
                    <li className="list-group-item list-group-item-info">Enable this function will enable an algorithm to manage website overload</li>
                </ul>
                <small id="manifest-version" className="text text-secondary">version {webexVersion}</small>
            </div>
            
        </React.Fragment>
    }
}*/

export function SettingsPanel() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
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
            <Button>
              Toggle Edition mode: OFF
            </Button>
            <h5>Storage</h5>
            <ListGroup>
              <Accordion>
                <AccordionItem>
                  <AccordionHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-down" viewBox="0 0 16 16">
                                          <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/>
                                          <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg> Import data (experimental)
                  </AccordionHeader>
                  <AccordionBody>
                    LOl
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
              <Button onClick={TabService.download}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/>
                                  <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                </svg>
                              Export data
              </Button>
            </ListGroup>
            <br></br>
            <h5>Performances</h5>
            <ListGroup>
              <ListGroupItem>Load all tabs at a same time <b>OFF</b></ListGroupItem>
              <ListGroupItem variant="info">Enable this function will enable an algorithm to manage website overload</ListGroupItem>
            </ListGroup>

            <h5>Development tools</h5>
            <ListGroup>
              <Button variant="outline-danger">Remove a Tab</Button>
              <Button variant="secondary">Refresh</Button>
            </ListGroup>
            
            <br></br>
            <ListGroup>
              <Button variant="danger" onClick={TabService.removeAllTabsFromStorage}>Clear all data</Button>
            </ListGroup>
            <small id="manifest-version" className="text text-secondary">version {webexVersion} (dev)</small>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }