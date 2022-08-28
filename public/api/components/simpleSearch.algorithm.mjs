import { TabService } from "../services/tab.service.mjs";

export class SearchAlgorithm{
    constructor(){}

    /**
     * Initialize the algorithm
     */
    init(){
        //TabService.loadedTabs = array.slice();
        this.history = new Object(); // history use to be defined
    }

    /**
     * Search a tab containing the given string
     * @param {*} string 
     */
    search(string){

        let regexp = new RegExp(string,'i');

        Object.keys(TabService.loadedTabs).forEach(moodID=>{
            for (let groupID = 0; groupID < TabService.loadedTabs[moodID].length; groupID++) {
                for (let index = 0; index < TabService.loadedTabs[moodID][groupID].length; index++) {
                    const element = TabService.loadedTabs[moodID][groupID][index];
                    if(element.match != undefined){
                        element.show(element.match(regexp));
                    }else{
                        console.error("match(regexp) does't exist on element "+index);
                        console.error(element);
                    }
                }
            }
        })
                


        //idToShow in history
        /*regexp = new RegExp(string,'i');
        
        if (this.history[string] == undefined) {
            for (let index = 0; index < array.length; index++) {
                const element = TabService.loadedTabs[index];
                if(element.match != undefined){
                    if(!element.match(regexp)){
                        TabService.loadedTabs.splice(index,1);
                        index--;
                    }
                }else{
                    console.error("match(regexp) does't exist on element "+index);
                    console.error(element);
                }
            }
        } else {
            
        }*/
    }

    /**
     * @unused Empty the history
     */
    emptyHistory(){

    }
}