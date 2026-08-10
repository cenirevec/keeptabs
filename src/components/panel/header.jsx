import React from "react";
import { webexVersion } from "../../../public/api/shared.variables.mjs";
import { Button } from "react-bootstrap";
import { Services } from "../../services.jsx";
import { Settings } from "../../settings/Settings.jsx";


export class HeaderPanel extends React.Component {


    constructor(props) {
        super(props)
    }
         

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        return <header className="kt kt-panel kt-panel-header">
            <h1>KeepTabs</h1>
            <small className="text text-secondary">version {Services.data?.webexManifest?.version}</small>
            <Settings></Settings>
        </header>
    }
}

