import { IconReferencer } from "../../src/models/iconReferencer.model.js";
import { defaultData } from "./defaultData.mjs";

export const PatchListPath = {
    OBJECT_FOREACH: "#"
}

let iconReferencer = new IconReferencer();

const patchList = {
    versions: ["1.0.0", "2.0.0", "2.0.2", "2.0.3", "2.0.4", "2.1.0"], //Versions prises en charge
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
            forEach: {
                operations: {
                    "2": (category) => {
                        category.meta.deleteOnOpening = true;
                    },
                    "5": (category) => {
                        category.meta.name = "[OK] " + category.meta.name;
                    }
                },
                forEach: {
                    operations: {
                        "2": (category) => {
                            category.meta.deleteOnOpening = true;
                        },
                        "5": (category) => {
                            category.meta.name = "[OK] " + category.meta.name;
                        }
                    }
                }
            }
        }
    ]
}


export default patchList;