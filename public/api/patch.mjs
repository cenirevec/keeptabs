import { IconReferencer } from "../../src/models/iconReferencer.model.js";
import { defaultData, defaultModel } from "./defaultData.mjs";

export const PatchListPath = {
    OBJECT_FOREACH: "#"
}

let iconReferencer = new IconReferencer();

const patchList = {
    versions: ["1.0.0", "2.0.0", "2.0.2", "2.0.3", "2.0.4", "2.1.0", "2.1.0.1", "2.1.1", "2.1.2", "2.1.3"], //Versions prises en charge
    //          0       1       2       3           4       5           6       7       8           9
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
                "7": (meta) => {
                    for (const key in meta.shortcuts) {
                        if (!Object.hasOwn(meta.shortcuts, key)) continue;

                        meta.shortcuts[key].description = "";
                    }
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
            operations: {
                "9": (categories)=>{
                    let categoriesArray = Object.values(categories);
                    //Adding faves category
                    console.log("categoriesArray",categoriesArray);
                    categoriesArray.splice(1,0,defaultModel.model.categories["1"]);

                    categories = {...categoriesArray};
                }
            },
            forEach: {
                _path: "category",
                children: [
                    {
                        path: "meta",
                        operations: {
                            "2": (categoryMeta) => {
                                categoryMeta.deleteOnOpening = true;
                            },
                            "6": (categoryMeta) => {
                                if (categoryMeta.translationLabel == "categories.names.temporary") {
                                    delete categoryMeta.hidding;
                                    categoryMeta.expiration = 30
                                    categoryMeta.hidden = 14
                                } else {
                                    categoryMeta.expiration = -1
                                    categoryMeta.hidden = -1
                                }
                            },
                            "8": (categoryMeta) => {
                                categoryMeta.description = "";
                            },
                            "9": (meta) => {
                                if (meta.translationLabel == "categories.names.temporary") {
                                    meta.translationLabel = "category.temporary";
                                    meta.pinned = true;
                                }else{
                                    meta.pinned = false;
                                }
                            }

                        }
                    },
                    {
                        path: "tabGroups",
                        operations: {
                            "2": (tabGroup) => {
                                tabGroup.meta.created = tabGroup.meta.lastAccessed;
                                tabGroup.meta.name = tabGroup.meta.name ?? tabGroup.name;
                                tabGroup.meta.deleteOnOpening = true;

                                delete tabGroup.name;
                            }
                        },
                        forEach: {
                            _path: "tabGroup",
                            children: [
                                {
                                    path: "meta"
                                },
                                {
                                    path: "tabs",
                                    forEach: {
                                        _path: "tab",
                                        operations: {
                                            "5": (tab) => {
                                                if (tab.favicon)
                                                    tab.faviconId = iconReferencer.getFaviconIdByURL(tab.favicon);

                                                tab.favicon = "";
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]

            }
        }
    ]
}


export default patchList;