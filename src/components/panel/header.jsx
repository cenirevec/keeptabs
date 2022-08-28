import React from "react";
import {webexVersion} from "../../../public/api/shared.variables.mjs";
import { SettingsPanel } from "./settings.jsx";

export class HeaderPanel extends React.Component{  
    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        return <header className="kt kt-panel kt-panel-header">
                    <h1>KeepTabs</h1>
                    <small className="text text-secondary">version {webexVersion}</small>
                    <SettingsPanel/>
                </header>
    }
}

