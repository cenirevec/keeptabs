import React from "react";
import { webexVersion } from "../../../public/api/shared.variables.mjs";
import { SettingsPanel } from "./settings.jsx";
import { Button } from "react-bootstrap";


export class HeaderPanel extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            showSettings: false
        }

        this.setShow = this.setShow.bind(this);
    }

    setShow(newState) {
        this.setState({
            showSettings: newState
        })
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        return <header className="kt kt-panel kt-panel-header">
            <h1>KeepTabs</h1>
            <small className="text text-secondary">version {webexVersion}</small>
            <Button id="settings-btn" variant="outline-primary" onClick={() => this.setShow(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                </svg>
                Settings
            </Button>
            

            <SettingsPanel
                show={this.state.showSettings}
                setShow={this.setShow} />
        </header>
    }
}

