import React from "react";
import { Browser, timeSince } from "../../../../public/api/shared.variables.mjs";
import { Services } from "../../../services.jsx";
import './tab-reduced.css'

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
    getTabFavicon(tab,id){
        let favicon;
        if (tab.faviconId != undefined) {
            favicon = Services.favicons.getURLByFaviconId(tab.faviconId);
        } else {
            favicon = tab.faviconUrl;
        }
        return <img onClick={()=>this.goto(tab.id)} title={tab.title} key={id} src={favicon}/>
    }

    goto(id){
        browser.tabs.update(id,{active:true});
    }

    render() {
        // Don't do anything else if not enough tabs are openned
        if (this.props.tabList.length <= 0){
            return;
        }
        
        // Add a reduced version when the threshold is reached
        return <li className="kt kt-component kt-component-tab-reduced list-group-item list-group-item-action">
            <span className="kt-component-tab-reduced-imgs">{this.props.tabList.map((tab,id)=>this.getTabFavicon(tab,id))}</span>
            <b> {this.props.tabList.length} more tabs</b>
        </li>
    }
}