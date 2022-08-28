import DataService from "./data.service.mjs";

export class CategoryService {

    model = DataService.model;

    defaultTabGroupData = {
        "meta": {
            "lastAccessed": new Date().valueOf(),
            "name":null
        },
        "tabs": []
    }

    defaultCategoryData = {
        "meta":{
            name: "newCategory",
            expiration: 30*24*3600*1000
        },
        "tabGroups":[]
    }

    constructor(){
        this.create = this.create.bind(this);
    }

    /**
     * Generate an unique category id
     * @returns A new category id
     */
    generateCategoryId(){
        let ids = Object.keys(this.model.categories);
        return parseInt(ids[ids.length -1]) + 1;
    }

    /**
     * Rename a category
     * @param {object} category The category to rename
     * @param {string} newName Name to give to the category
     * @returns True if the operation succeeded, False otherwise
     */
    static rename(category,newName){
        category.meta.name = newName;
        DataService.save();
        //DataService.patch()
    }

    /**
     * Create a category
     * @param {string} name Name of the category
     */
    static create(name){
        //Get an unique id
        let id = this.generateCategoryId();
        //Create a new category object
        let category = JSON.parse(JSON.stringify(this.defaultCategoryData));
        category.meta.name = name;
        //Add the category to the object
        this.model.categories[id] = category;
        DataService.save();
    }

    /**
     * Delete a category
     * @param {*} id 
     */
    static delete(id){
        delete this.model.categories[id];
        DataService.save();
    }
}

export default CategoryService;