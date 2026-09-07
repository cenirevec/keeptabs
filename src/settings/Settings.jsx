import React from "react";
import './Settings.css'
import { GeneralSettings } from "./settings-pages/general/general-settings.jsx";
import { TemplateSettings } from "./settings-pages/template/template.jsx";
import { Button, CloseButton, Nav, Tab, TabContainer } from "react-bootstrap";
import { AliasSettings } from "./settings-pages/aliases/aliases-settings.jsx";
import { DeveloperSettings } from "./settings-pages/dev/dev-settings.jsx";
import { Services } from "../services.jsx";
import { FileSettings } from "./settings-pages/file/file-settings.jsx";
import { icons } from "../../public/api/shared.variables.mjs";

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
        if (!this.state.closed) {
            return <div className="kt kt-panel kt-panel-settings">

                <div className="kt kt-component kt-settings-header">
                    <h2>Settings</h2>
                    <CloseButton onClick={() => this.close()}></CloseButton>
                </div>
                <div className="kt kt-component kt-settings-body">

                    <TabContainer defaultActiveKey="general">
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="general">General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="alias">Aliases</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="file">Import/Export</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="dev">Developer settings</Nav.Link>
                            </Nav.Item>

                            <small id="manifest-version" className="text text-secondary">Version {Services.data?.webexManifest?.version} (dev)</small>
                      
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="general"><GeneralSettings></GeneralSettings></Tab.Pane>
                            <Tab.Pane eventKey="alias"><AliasSettings></AliasSettings></Tab.Pane>
                            <Tab.Pane eventKey="file"><FileSettings></FileSettings></Tab.Pane>
                            <Tab.Pane eventKey="dev"><DeveloperSettings></DeveloperSettings></Tab.Pane>
                        </Tab.Content>
                    </TabContainer>
                </div>
            </div>
        } else {
            return (
                <>
                    <Button id="settings-btn" variant="outline-primary" onClick={() => this.open()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                            <path d={icons.raw.settings} />
                        </svg>
                        Settings
                    </Button>
                </>
            )
        }
    }
}