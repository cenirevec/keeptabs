export class TabModel {
    id = -1;
    url = "";
    title = "";
    favicon = "";
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