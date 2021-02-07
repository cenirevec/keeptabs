import { TabManagementObject } from "./tabManagementObject.js";

console.log("Front-end");


class JSONtoDOMParser{
    constructor(){
        this.tab = new TabManagementObject();
        console.log("bite")
    }

    hello(){
        let el = document.createElement("div");
        el.innerHTML = "Hello World";
        return el;
    }
}

jsdomparam = new JSONtoDOMParser();