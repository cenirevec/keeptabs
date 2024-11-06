import { Browser } from "../../public/api/shared.variables.mjs";
import { Services } from "../services.jsx";


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
    /** Tab's icon ID */
    faviconId = "";
    /** Last access timestamp */
    lastAccessed = 0;

    constructor(tab){
        this.id = tab.id;
        this.url = tab.url;
        this.domain = this.getDomainName(tab);
        this.title = tab.title;
        
        let faviconUrl = (tab.favicon != undefined)? tab.favicon : tab.favIconUrl;
        let faviconId;

        if(Services.favicons){
            faviconId = Services.favicons?.getFaviconIdByURL(faviconUrl);
        }
        else{
            if(faviconUrl.startsWith("chrome://")){
                faviconUrl =  "./media/ico-48.png";
            }
            
            this.favicon = faviconUrl;
        }

        this.faviconId = faviconId ?? 0;
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