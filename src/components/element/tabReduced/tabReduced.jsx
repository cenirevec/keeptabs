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
        super(props)
    }

    /**
     * TO BE DEFINED
     */
    showMore() {

    }

    // /**
    //  * Get Tab Favicons
    //  * @param {*} tab 
    //  * @param {number} id 
    //  * @returns 
    //  */
    // getTabFavicon(tab,id) {
    //     let favicon;
    //     if (tab.faviconId != undefined) {
    //         favicon = Services.favicons.getURLByFaviconId(tab.faviconId);
    //     } else {
    //         favicon = tab.faviconUrl;
    //     }
    //     return <img onClick={() => this.goto(tab.id)} title={tab.title} key={id} src={favicon} />

    // }   

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

        return Object.entries(reducedTabs).map((rtab)=>this.renderReducedTab(rtab));
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
    renderReducedTab(rtab){
        let favicon = Services.favicons.getURLByFaviconId(rtab[0]);
        return <span className="kt-component-reduced-tab-pill">
            <img key={rtab[0]} src={favicon}/>
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
        if (this.props.tabList.length <= 0) {
            return;
        }

        let reducedTabs = this.getReducedTabs(this.props.tabList);

        // Add a reduced version when the threshold is reached
        return <li className="kt kt-component kt-component-tab-reduced list-group-item list-group-item-action">
            <span className="kt-component-tab-reduced-imgs">{reducedTabs}</span>
            <b> {this.props.tabList.length} more tabs</b>
        </li>
    }
}