
//Functions about tab identification
let InstanceCtrl = {
    "data": {
        "instances": new Map()
    },
    // Ping back an instance and give it an UID
    "subscribe": (sender, sendResponse) => {
        let uid = InstanceCtrl.generateUid(sender);
        InstanceCtrl.data.instances.set(uid,{alive:true,lastChecked: Date.now(), lastUpdated: Date.now()})
        sendResponse({ greeting: "I send you your identifier", identifier: uid});
    },
    // Generate an unique ID
    "generateUid": (sender) => {
        return `w${sender.tab.windowId}i${sender.tab.id}`;
    },
    "acknowledge": (sender,sendResponse) => {
        console.log("Ack received...")
        sendResponse({ code: "200 OK" });
    },

    "checkIfAlive": (instanceUID) => {
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                dst: instanceUID,
                src: "server",
                actionId: "acknowledge",
                content: null
            }).then((response) => {
                console.log(response)
                instanceInfo = InstanceCtrl.data.instances.get(instanceUID);
                console.log(instanceInfo)
                resolve(200);
            }, (error) => {
                console.error(error);
                reject(error);
            })
        });
    },

    "logData": (instanceUID,log) => {
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                dst: instanceUID,
                src: "server",
                actionId: "log",
                content: log
            }).then((response) => {
                console.log(response)
                resolve(200);
            }, (error) => {
                console.error(error);
                reject(error);
            })
        });
    },

    "reload": () => {
        // InstanceCtrl.data.instances.forEach((_,instanceUID)=>{
        //     return new Promise((resolve, reject) => {
        //         browser.runtime.sendMessage({
        //             dst: instanceUID,
        //             src: "server",
        //             actionId: "reload",
        //             content: null
        //         }).then((response) => {
        //             console.log(response)
        //             resolve(200);
        //         }, (error) => {
        //             console.error(error);
        //             reject(error);
        //         })
        //     });
        // })
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage({
                dst: "all_instances",
                src: "server",
                actionId: "reload",
                content: null
            }).then((response) => {
                console.log(response)
                resolve(200);
            }, (error) => {
                console.error(error);
                reject(error);
            })
        });
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
    if(message.dst != "server") return;

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
            InstanceCtrl.data.instances.forEach((_,instanceUID)=>{
                InstanceCtrl.checkIfAlive(instanceUID);
            });            
            break;
        case "getMap":
            InstanceCtrl.getMap(sendResponse);
            break;
        case "reload":
            InstanceCtrl.reload(sendResponse);
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