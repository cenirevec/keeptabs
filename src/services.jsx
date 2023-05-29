import CategoryService from "../public/api/services/data/category.service.mjs";
import DataService from "../public/api/services/data/data.service.mjs";
import TabService from "../public/api/services/data/tabs.services.mjs";

class AllServices{
    
    data = new DataService();
    category = new CategoryService();
    tabs = new TabService();

    constructor(){
        
    }
}

export const Services = new AllServices();