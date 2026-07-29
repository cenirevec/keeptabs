import { currentDataVersion } from "./shared.variables.mjs";


export const LoadingMode = {
    DIFFERED: "differed",
    LAZY: "lazy"
}



export const defaultData = {
    // Default settings data
    settings: {
        loading: {
            mode: LoadingMode.DIFFERED,
            interval: 0,
            makeOpenedTabActive: false
        }
    },

    //Test data added
    shortcuts: {
        searchEngine: {
            value: [
                "www.qwant.com",
                "www.lilo.org",
                "www.google.com",
                "www.bing.com"
            ]
        },
        t: {
            value:["www.youtube.com","www.furaffinity.net"]
        },
        yt:{
            value:["www.youtube.com"]
        }
    },

    icons: {
        "unknown": "./media/ico.png",
        "settings": "./media/ico.png",
        "keeptabs": "./media/ico.png",
    }
}

// Default model data
export const defaultModel = {
    model: {
        meta: {
            version: currentDataVersion,
            settings: defaultData.settings,
            shortcuts: defaultData.shortcuts
        },
        icons:{
            references: [],
            default: defaultData.icons
        },
        categories: {
            "0": {
                meta: {
                    expiration: 30,
                    hidden: 14,
                    name: "temporary",
                    translationLabel: "categories.names.temporary",
                    deleteOnOpening: true
                },
                tabGroups: []
            }
        },
    }
}
