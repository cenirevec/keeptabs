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

        return <img key={id} src={favicon}/>
    }

    render() {
        console.log(this.props.tabList)
        if (this.props.tabList.length <= 0){
            return;
        }
        

        return <li className="kt kt-component kt-component-tab-reduced list-group-item list-group-item-action">
            {this.props.tabList.map((tab,id)=>this.getTabFavicon(tab,id))}
            <b> {this.props.tabList.length} more tabs</b>
        </li>
    }
}