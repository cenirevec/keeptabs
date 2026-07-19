
export class IconReferencer{

    // Websites related icon references
    references = [];

    // Extension related icon references
    default = {
        "unknown": "./media/ico.png",
        "settings": "./media/ico.png",
        "keeptabs": "./media/ico.png",
    }

    // Constructor
    constructor(references = []){
        this.references = references;
    }

    /**
     * Get an id according to the favicon URL
     * @param {string} imageURL URL of the favicon
     * @returns ID of a favicon
     */
    getFaviconIdByURL(imageURL){
        if(imageURL == undefined){
            imageURL = this.default.unknown;
        }
        else if(imageURL.startsWith("chrome://")){
            imageURL = this.default.settings;
        }

        let iconId = this.references.findIndex(x=>x == imageURL);

        if (iconId == -1){
            // Get the position of the added icon (array.length - 1)
            iconId += this.references.push(imageURL);
        }
        
        return iconId;
    }

    /**
     * Get and Icon URL By its ID
     * @param {number} faviconId Favicon URL ID
     * @returns URL of a favicon
     */
    getURLByFaviconId(faviconId){
        return this.references[faviconId] ?? this.default.unknown;
    }

}