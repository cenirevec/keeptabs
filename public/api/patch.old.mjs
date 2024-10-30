import { IconReferencer } from "../../src/models/iconReferencer.model.js";
import { defaultData } from "./defaultData.mjs";

export const PatchListPath = {
    OBJECT_FOREACH : "#"
}

let iconReferencer = new IconReferencer();

const patchList = {
    versions: ["1.0.0","2.0.0", "2.0.2", "2.0.3","2.0.4","2.1.0"], //Versions prises en charge
    patchs: [
        {
            path: "meta",
            operations: {
                "3": (meta) => {
                    meta.settings = defaultData.settings
                },
                "4": (meta) => {
                    meta.shortcuts = defaultData.shortcuts
                },
                
            }
        },
        {
            path: "icons",
            operations: {
                "5": (icons) => {
                    icons.references = iconReferencer.references;
                    icons.default = iconReferencer.default;
                }
            }
        },
        {
            path: "categories",
            children: [
                {
                    path: PatchListPath.OBJECT_FOREACH,
                    operations: {
                        "2": (category) => {
                            category.meta.deleteOnOpening = true;
                        },
                        "5": (category) => {
                            console.log(category);
                            category.meta.name = "[OK] " + category.meta.name;
                        }
                    },
                    children: [
                        {
                            path: "tabGroups",
                            operations: {
                                "2": (tabGroup) => {
                                    tabGroup.meta.created = tabGroup.meta.lastAccessed;
                                    tabGroup.meta.name = tabGroup.meta.name ?? tabGroup.name;
                                    tabGroup.meta.deleteOnOpening = true;

                                    delete tabGroup.name;
                                },
                                // "5": (tabGroup) => {
                                //     console.log(tabGroup);
                                //     //tabGroup.tabs.forEach(tab=>{tab.title += "<= (OK)";})
                                // }
                            },
                            children: [
                                {
                                    path: PatchListPath.OBJECT_FOREACH,
                                    operations: {
                                        "5": (tab) => {
                                                    //tab.faviconId = iconReferencer.getFaviconIdByURL(tab.favicon);
                                                    console.log("tabGroup",tab);
                                                    //tab.title += "<= (OK)";
                                                    //delete tab.favicon;
                                                    //tab.favicon = "";
                                                }
                                    }
                                    ,
                                    children: [
                                        {
                                            path: "tabs",
                                            operations: {
                                                "5": (tab) => {
                                                    //tab.faviconId = iconReferencer.getFaviconIdByURL(tab.favicon);
                                                    //console.log(tab);
                                                    tab.title += "<= (OK)";
                                                    //delete tab.favicon;
                                                    //tab.favicon = "";
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}


export default patchList;