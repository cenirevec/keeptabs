import React from "react";
import { Browser, timeSince } from "../../../public/api/shared.variables.mjs";
import { Services } from "../../services.jsx";

export class Tab extends React.Component {

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props)

        this.onOpen = this.onOpen.bind(this);
    }

    /**
     * On tab opening event handler
     * @param {Event} event 
     */
    onOpen(event) {
        if (event && (event.which == 1 || event.button == 0)) {
            //Open the tab
            Browser.tabs.create({ url: this.props.tab.url, active: true });
            //Remove tab from list
            this.delete();
        }
    }

    /**
     * Remove tab from list
     */
    delete() {
        this.props.delete();
    }


    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        if (this.props.tab == undefined)
            return;

        let addedClasses = "";
        const { url, title, lastAccessed } = this.props.tab;

        let favicon;
        if (this.props.tab.faviconId != undefined) {
            favicon = Services.favicons.getURLByFaviconId(this.props.tab.faviconId);
        } else {
            favicon = this.props.tab.faviconUrl;
        }

        let date = new Date(lastAccessed);

        return <li className="kt kt-component kt-component-tab list-group-item list-group-item-action" onMouseDown={this.onOpen}>
            <img src={favicon} className={addedClasses} />
            {this.props.context == 'saved' &&
                <a title={title}>{title}</a>}
            {this.props.context == 'current' &&
                <span title={title}
                >{title}</span>}
            <small>{timeSince(date)}</small>
        </li>;
    }
}