import React from "react";
import './Settings.css'
import { GeneralSettings } from "./settings-pages/general/general-settings.jsx";
import { TemplateSettings } from "./settings-pages/template/template.jsx";
import { Button, CloseButton, Nav, Tab, TabContainer } from "react-bootstrap";
import { AliasSettings } from "./settings-pages/aliases/aliases-settings.jsx";
import { DeveloperSettings } from "./settings-pages/dev/dev-settings.jsx";
import { Services } from "../services.jsx";

export class Settings extends React.Component {


    constructor(props) {
        super(props);

        this.state = { closed: true };
    }

    /**
     * Open the settings window
     */
    open() {
        this.setState({ closed: false });
    }

    /**
     * Close the settings window
     */
    close() {
        this.setState({ closed: true });
    }

    /**
     * Render
     * @returns 
     */
    render() {

        let panelClass = (this.state.closed)? "kt-panel-settings-closed": ""
        return <>

            <Button id="settings-btn" variant="outline-primary" onClick={() => this.open()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                </svg>
                Settings
            </Button>
            {!this.state.closed && <div className="background-blur"  onClick={() => this.close()}></div>}
            <div className={"kt kt-panel kt-panel-settings "+panelClass}>

                <div className="kt kt-component kt-settings-header">
                    <h2>Settings</h2>
                    <CloseButton onClick={() => this.close()}></CloseButton>
                </div>
                <div className="kt kt-component kt-settings-body">

                    {!this.state.closed && <TabContainer defaultActiveKey="general">
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="general">General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="alias">Aliases</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="dev">Developer settings</Nav.Link>
                            </Nav.Item>

                            <small id="manifest-version" className="text text-secondary">Version {Services.data?.webexManifest?.version} (dev)</small>

                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="general"><GeneralSettings></GeneralSettings></Tab.Pane>
                            <Tab.Pane eventKey="alias"><AliasSettings></AliasSettings></Tab.Pane>
                            <Tab.Pane eventKey="dev"><DeveloperSettings></DeveloperSettings></Tab.Pane>
                        </Tab.Content>
                    </TabContainer>}
                </div>
            </div>
        </>
    }
}