import { TabManagementObject } from "./tabManagementObject";

console.log("Front-end");


export class JSONtoDOMParser{
    constructor(){
        this.tab = new TabManagementObject();
    }

    hello(){
        let el = document.createElement("div");
        el.innerHTML = "Hello World";
        return el;
    }
}