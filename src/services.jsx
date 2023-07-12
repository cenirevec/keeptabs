import CategoryService from "../public/api/services/data/category.service.mjs";
import DataService from "../public/api/services/data/data.service.mjs";
import TabService from "../public/api/services/data/tabs.services.mjs";

class AllServices{
    
    data = new DataService();
    category = new CategoryService();
    tabs = new TabService();

    /**
     * Signal observers
     */
    observer = {
        categoryListChange: false
    }
    /**
     * Reference to the main component
     */
    main;

    constructor(){
    }

    //@todo Improve to auto update all elements working with categories for example
    emitSignal(name){
        this.observer[name] = !this.observer[name];
    }
}

export const Services = new AllServices();