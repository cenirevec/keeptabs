class InstanceController {

    static data = {
        "instances": new Map()
    }

    constructor() {

    }

    /** 
    * Send a command to the background scripts
    * @param {string} actionId Id of the action to run in the backend
    * @param {Object|any} content Content of the request
    * @param {Function} callback Function to execute when the backend answers
    * @param {"server"|"all_instances"} dst Destination
     * @returns 
     */
    static _do(actionId,dst,callback,content) {
        if (callback == undefined) {
            callback = (response, resolve) => {
                resolve(200);
            }
        }
        return new Promise((resolve, reject) => {
            //@ts-ignore
            browser.runtime.sendMessage({
                src: "server", dst, actionId, content
            }).then((response) => {
                callback(response, resolve);
            }, (error) => {
                console.error(error);
                reject(error);
            })
        });
    }


    /**
     * Ping back an instance and give it an UID
     * @param {*} sender 
     * @param {(arg0: { greeting: string; identifier: string; }) => void} sendResponse 
     */
    static subscribe(sender, sendResponse) {
        let uid = this.generateUid(sender);
        this.data.instances.set(uid, { alive: true, lastChecked: Date.now(), lastUpdated: Date.now() })
        sendResponse({ greeting: "I send you your identifier", identifier: uid });
    }

    /**
     * 
     * @param {{ tab: { windowId: any; id: any; }; }} sender 
     * @returns 
     */
    // Generate an unique ID
    static generateUid(sender) {
        return `w${sender.tab.windowId}i${sender.tab.id}`;
    }

    /**
     * 
     * @param {*} _ 
     * @param {: (arg0: { code: string; }) => void} sendResponse 
     */
    static acknowledge(_, sendResponse) {
        console.log("Ack received...")
        sendResponse({ code: "200 OK" });
    }

    /**
     * 
     * @param {"server" | "all_instances"} instanceUID 
     * @returns 
     */
    static checkIfAlive(instanceUID) {
        return this._do("acknowledge", instanceUID, (_, resolve) => {
            //instanceInfo = this.data.instances.get(instanceUID);
            resolve(200);
        })
    }

    /**
     * 
     * @param {"server" | "all_instances"} instanceUID 
     * @param {*} content 
     */
    static console_log(
        instanceUID, 
        content
    ) {
        if (["info", "debug", "log", "error"].indexOf(content.level) == -1) {
            content.level = "log";
        };

        //Log the message
        console.log(`[${instanceUID}]  ${content.message}`);
    }

    static reload() {
        return this._do("reload");
    }

    /**
     * Get Map
     * @param {(arg0: Map<any, any>) => void} sendResponse 
     */
    static getMap(sendResponse) {
        console.log("Ack received...")
        sendResponse(this.data.instances);
    }
}

/**
 * Function to handle the signals from the web pages
 * @param { dst: string; actionId: any; src: string; content: any; } message Data sent to the back-end
 * @param {*} sender Data to identifier the sender
 * @param {*} sendResponse Callback response to give
 */
function handleContentScriptMessage(message, sender, sendResponse) {
    if (message.dst != "server") return;

    switch (message.actionId) {
        case "hello":
            InstanceController.subscribe(sender, sendResponse);
            break;
        case "acknowledge":
            InstanceController.acknowledge(sender, sendResponse);
            break;
        case "checkme":
            InstanceController.checkIfAlive(message.src);
            break;
        case "checkall":
            InstanceController.data.instances.forEach((_, instanceUID) => {
                InstanceController.checkIfAlive(instanceUID);
            });
            break;
        case "getMap":
            InstanceController.getMap(sendResponse);
            break;
        case "reload":
            InstanceController.reload();
            break;
        case "console":
            InstanceController.console_log(message.src, message.content);
            break;

        default:
            console.log("%s is not in the list of available methods", message.actionId)
            break;
    }
}
//@ts-ignore
browser.runtime.onMessage.addListener(handleContentScriptMessage);

//@ts-ignore
let promise = browser.storage.local.get("model");

promise.then((json) => {
    console.log(json)
})

//@ts-ignore
console.log("Avec tsig")

InstanceController._do();