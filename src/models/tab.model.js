import { Browser } from "../../public/api/shared.variables.mjs";

export class TabModel {
    /** Identifier of the tab */
    id = -1;
    /** URL of the tab */
    url = "";
    /** Domain name */
    domain = "";
    /** Tab's title */
    title = "";
    /** Tab's icon */
    favicon = "";
    /** Last access timestamp */
    lastAccessed = 0;

    constructor(tab){
        this.id = tab.id;
        this.url = tab.url;
        this.domain = this.getDomainName(tab);
        this.title = tab.title;
        this.favicon = (tab.favicon != undefined)?tab.favicon : tab.favIconUrl;
        this.lastAccessed = 
            (tab.lastAccessed != undefined)? tab.lastAccessed : Date.now();
    }

    /**
     * Get the domain name of the website
     */
    getDomainName(tab){
        let re = /https?:\/\/([^\/]*)/;
        if(tab.url.match(re) == null)
            return "";

        return tab.url.match(re)[1];
    }

    /**
     * Open the current tab
     */
    open(options){
        options = (options == undefined || options == null)? {}:options;
        options["url"] = tab.url;

        Browser.tabs.create(options);
        return true;
    }
}