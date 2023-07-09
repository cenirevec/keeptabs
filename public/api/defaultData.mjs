import { currentDataVersion } from "./shared.variables.mjs";


export const LoadingMode = {
    DIFFERED : "differed",
    LAZY : "lazy"
}



export const defaultData = {
    // Default settings data
    settings:{
        loading:{
            mode: LoadingMode.DIFFERED,
            interval: 0,
            makeOpenedTabActive: false
        }
    },

}

// Default model data
export const defaultModel = {
        model: {
            meta: {
                version: currentDataVersion,
                settings : defaultData.settings
            },
            categories: {
                "0": {
                    meta: {
                        expiration: 30 * 24 * 3600 * 1000,
                        hidding: 1378400,
                        name: "temporary",
                        translationLabel: "categories.names.temporary",
                        deleteOnOpening: true
                    },
                    tabGroups: []
                }
            }
        }
}
