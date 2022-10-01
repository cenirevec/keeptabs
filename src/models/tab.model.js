export class TabModel {
    /** Identifier of the tab */
    id = -1;
    /** URL of the tab */
    url = "";
    /** Tab's title */
    title = "";
    /** Tab's icon */
    favicon = "";
    /** Last access timestamp */
    lastAccessed = 0;

    constructor(tab){
        this.id = tab.id;
        this.url = tab.url;
        this.title = tab.title;
        this.favicon = (tab.favicon != undefined)?tab.favicon : tab.favIconUrl;
        this.lastAccessed = 
            (tab.lastAccessed != undefined)? tab.lastAccessed : Date.now();
    }
}