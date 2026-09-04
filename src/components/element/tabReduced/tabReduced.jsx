import React from "react";
import { Browser, timeSince } from "../../../../public/api/shared.variables.mjs";
import { Services } from "../../../services.jsx";
import './tabReduced.css'

export class TabReduced extends React.Component {

    /**
     * Whether or not the list is collapsed
     */
    collapsed = true;

    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props) {
        super(props);
    }

    /**
     * Toggle to define whether the whole list of tabs is shown or not
     */
    toggleShowMore() {
        this.props.toggleShowMore(!this.props.expand);
    }

    /**
     * Get a summary of the currently openned tab
     * @param {*} tabs 
     * @returns 
     */
    getReducedTabs(tabs) {
        //Sort tabs by favicon
        let reducedTabs = tabs.reduce((_reducedTabs, tab) => {
            let tab_favicon = tab.faviconId;

            if (!_reducedTabs[tab_favicon]) {
                _reducedTabs[tab_favicon] = 1;
            } else {
                _reducedTabs[tab_favicon]++;
            }

            return _reducedTabs;
        }, new Object());

        return Object.entries(reducedTabs).map((rtab) => this.renderReducedTab(rtab));
    }

    /**
     * Go to a tab based on its id
     * @param {number} id tab identifier
     */
    goto(id) {
        browser.tabs.update(id, { active: true });
    }

    /**
     * Render the reduced version of tab list
     * @param {*} rtab 
     * @returns 
     */
    renderReducedTab(rtab) {
        let favicon = Services.favicons.getURLByFaviconId(rtab[0]);
        return <span key={rtab[0]} className="kt-component-reduced-tab-pill">
            <img key={rtab[0]} src={favicon} />
            <span>{rtab[1]}</span>
        </span>
        return;
    }

    /**
     * Render
     * @returns 
     */
    render() {
        // Don't do anything else if not enough tabs are openned
        if (this.props.tabs.length <= 0) {
            return;
        }

        let reducedTabs = this.getReducedTabs(this.props.tabs);

        // Add a reduced version when the threshold is reached
        return <li onClick={()=>this.toggleShowMore()} className="kt kt-component kt-component-tab-reduced list-group-item list-group-item-action">
            {!this.props.expand && <>
                    <span className="kt-component-tab-reduced-imgs">{reducedTabs}</span>
                    <b> {this.props.tabs.length} more tabs</b>
                </>}

            {this.props.expand && <b>Show less</b>}
        </li>
    }
}