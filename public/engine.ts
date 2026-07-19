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
    static _do(actionId: string, dst: "server" | "all_instances" = "all_instances", callback?, content?) {
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
     * @param {*} sendResponse 
     */
    static subscribe(sender, sendResponse) {
        let uid = this.generateUid(sender);
        this.data.instances.set(uid, { alive: true, lastChecked: Date.now(), lastUpdated: Date.now() })
        sendResponse({ greeting: "I send you your identifier", identifier: uid });
    }

    // Generate an unique ID
    static generateUid(sender) {
        return `w${sender.tab.windowId}i${sender.tab.id}`;
    }

    static acknowledge(_, sendResponse) {
        console.log("Ack received...")
        sendResponse({ code: "200 OK" });
    }

    static checkIfAlive(instanceUID: "server" | "all_instances") {
        return this._do("acknowledge", instanceUID, (_, resolve) => {
            //instanceInfo = this.data.instances.get(instanceUID);
            resolve(200);
        })
    }

    static console_log(
        instanceUID: "server" | "all_instances", 
        content: any
    ) {
        if (["info", "debug", "log", "error"].indexOf(content.level) == -1) {
            content.level = "log";
        };

        //Log the message
        console[content.level](`[${instanceUID}]  ${content.message}`);
    }

    static reload() {
        return this._do("reload");
    }

    static getMap(sendResponse) {
        console.log("Ack received...")
        sendResponse(this.data.instances);
    }
}

/**
 * Function to handle the signals from the web pages
 * @param {*} message Data sent to the back-end
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

promise.then(json => {
    console.log(json)
})