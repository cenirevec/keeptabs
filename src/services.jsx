import CategoryService from "../public/api/services/data/category.service.mjs";
import DataService from "../public/api/services/data/data.service.mjs";
import TabService from "../public/api/services/data/tabs.services.mjs";
import { IconReferencer } from "./models/iconReferencer.model";

class AllServices{
    
    favicons;
    data = new DataService(this);
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

    //Improve to auto update all elements working with categories for example
    emitSignal(name){
        this.observer[name] = !this.observer[name];
    }

    //Set the reference of an icon
    setIconReferencer(){
        this.favicons = new IconReferencer(this.data.model.icons.references);
        this.data.model.icons = this.favicons;
    }
}

export const Services = new AllServices();