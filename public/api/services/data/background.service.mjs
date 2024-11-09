import { Services } from "../../../../src/services.jsx";

export class BackgroundService {

    /** Identifier of a KeepTabs instance */
    instanceId = undefined;

    constructor() {
        this.subscribe();
    }

    /**
     * Send a command to the background scripts
     * @param {string} actionId Id of the action to run in the backend
     * @param {Object|any} content Content of the request
     * @param {Function} callback Function to execute when the backend answers
     * @param {"server"|"all_instances"} dst Destination
     * @returns 
     */
    _do(actionId,callback,content,dst="server"){
        if (callback == undefined){
            callback = (response,resolve)=>{
                resolve(response);
            }
        }
        return new Promise((resolve, reject) => {

            console.log(this.instanceId)
            browser.runtime.sendMessage({
                dst,
                src: this.instanceId,
                actionId,
                content
            }).then((response) => {
                callback(response,resolve);
            }, (error) => {
                console.error(error);
                reject(error);
            })
        });
    }

    /**
     * Catch an error message
     * @param {string} errorMessage Error message to log
     */
    catch(errorMessage) {
        return this.log("error", message);
    }

    /**
     * Log a message
     * @param {string} level log level
     * @param {string} message Message to log
     */
    log(level, message) {
        return this._do("console",undefined,{level,message});
    }

    /**
     * Reload other instances of KeepTabs
     * @returns 
     */
    reloadOtherInstances() {
        return this._do("reload");
    }


    //Private Methods

    /**
     * Ping the back-end to get the tab identifier
     * @returns Tab identifer
     */
    subscribe() {
        return this._do("hello",(response,resolve)=>{
            this.instanceId = response.identifier;
            //Services.main?.instanceId = response.identifier;
            resolve(response.identifier);
        });
    }

    /**
     * Acknowledge the back-end 
     * @returns Tab identifer
     */
    acknowledge() {
        return this._do("acknowledge",(response,resolve)=>{
            resolve(response.code);
        });
    }

    /**
     * Acknowledge the back-end 
     * @returns Tab identifer
     */
    getMap() {
        return this._do("getMap");
    }

    checkInstance() {
        return this._do("checkme");
    }
}

export default BackgroundService;
