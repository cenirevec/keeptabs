import { defaultData } from "./defaultData.mjs";

export const PatchListPath = {
    OBJECT_FOREACH : "#"
}

const patchList = {
    versions: ["1.0.0","2.0.0", "2.0.2", "2.0.3"], //Versions prises en charge
    patchs: [
        {
            path: "meta",
            operations: {
                "3": (meta) => {
                    meta.settings = defaultData.settings
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
                            category.deleteOnOpening = true;
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
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
}


export default patchList;