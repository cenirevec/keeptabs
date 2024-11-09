//Functions about tab identification
let InstanceCtrl = {
    /**
* Send a command to the background scripts
* @param {string} actionId Id of the action to run in the backend
* @param {Object|any} content Content of the request
* @param {Function} callback Function to execute when the backend answers
* @param {"server"|"all_instances"} dst Destination
* @returns 
*/
    "_do": (actionId, dst, callback, content,) => {
        if (callback == undefined) {
            callback = (response, resolve) => {
                resolve(200);
            }
        }
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                src: "server", dst, actionId, content
            }).then((response) => {
                callback(response, resolve);
            }, (error) => {
                console.error(error);
                reject(error);
            })
        });
    },

    "data": {
        "instances": new Map()
    },
    // Ping back an instance and give it an UID
    "subscribe": (sender, sendResponse) => {
        let uid = InstanceCtrl.generateUid(sender);
        InstanceCtrl.data.instances.set(uid, { alive: true, lastChecked: Date.now(), lastUpdated: Date.now() })
        sendResponse({ greeting: "I send you your identifier", identifier: uid });
    },
    // Generate an unique ID
    "generateUid": (sender) => {
        return `w${sender.tab.windowId}i${sender.tab.id}`;
    },
    "acknowledge": (_, sendResponse) => {
        console.log("Ack received...")
        sendResponse({ code: "200 OK" });
    },

    "checkIfAlive": (instanceUID) => {
        return InstanceCtrl._do("acknowledge",instanceUID,(_,resolve) => {
            instanceInfo = InstanceCtrl.data.instances.get(instanceUID);
            resolve(200);
        })
    },

    "console_log": (instanceUID, content) => {
        if (["info", "debug", "log", "error"].indexOf(content.level) == -1) {
            content.level = "log";
        };

        //Log the message
        console[content.level](`[${instanceUID}]  ${content.message}`);
    },

    "reload": () => {
        return InstanceCtrl._do("reload","all_instances");
    },

    "getMap": (sendResponse) => {
        console.log("Ack received...")
        sendResponse(InstanceCtrl.data.instances);
    },
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
            InstanceCtrl.subscribe(sender, sendResponse);
            break;
        case "acknowledge":
            InstanceCtrl.acknowledge(sender, sendResponse);
            break;
        case "checkme":
            InstanceCtrl.checkIfAlive(message.src);
            break;
        case "checkall":
            InstanceCtrl.data.instances.forEach((_, instanceUID) => {
                InstanceCtrl.checkIfAlive(instanceUID);
            });
            break;
        case "getMap":
            InstanceCtrl.getMap(sendResponse);
            break;
        case "reload":
            InstanceCtrl.reload(sendResponse);
            break;
        case "console":
            InstanceCtrl.console_log(message.src, message.content);
            break;

        default:
            console.log("%s is not in the list of available methods", message.actionId)
            break;
    }
}

browser.runtime.onMessage.addListener(handleContentScriptMessage);


let promise = browser.storage.local.get("model");

promise.then(json => {
    console.log(json)
})