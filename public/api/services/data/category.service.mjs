import { Services } from "../../../../src/services.jsx";

export class CategoryService {

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
            expiration: 30*24*3600*1000,
            hidden: 14*24*3600*1000
        },
        "tabGroups":[]
    }

    constructor(){
        this.create = this.create.bind(this);
    }

    /**
     * Get a category by its index
     * @param {*} categoryId Index of the category
     * @returns 
     */
    get(categoryId){
        return Services.data?.model?.categories[categoryId];
    }

    /**
     * Get a category by its name
     * @param {*} name Name of the category
     * @returns 
     */
    getByName(name){
        let categories = Object.keys(Services.data.model.categories)
                               .map(categoryid=>Services.data.model.categories[categoryid])
        return categories.find(category => category.meta.name == name);
    }

    /**
     * Generate an unique category id
     * @returns A new category id
     */
    generateCategoryId(){
        let ids = Object.keys(Services.data?.model?.categories);
        return parseInt(ids[ids.length -1]) + 1;
    }

    /**
     * Rename a category
     * @param {object} category The category to rename
     * @param {string} newName Name to give to the category
     * @returns True if the operation succeeded, False otherwise
     */
    rename(category,newName){
        category.meta.name = newName;
        Services.data.save();
        Services.emitSignal("categoryListChange");
    }

    /**
     * Create a category
     * @param {string} name Name of the category
     */
    create(name,save = true){
        //Get an unique id
        let id = this.generateCategoryId();

        //Create a new category object
        let category = JSON.parse(JSON.stringify(this.defaultCategoryData));
        category.meta.name = name;

        //Add the category to the object
        Services.data.model.categories[id] = category;
       
        if(save) Services.data.save();
       // Services.emitSignal("categoryListChange");
        return category;
    }

    /**
     * Delete a category
     * @param {*} id 
     */
    delete(id){
        delete Services.data?.model?.categories[id];
        Services.data.save();
    }
}

export default CategoryService;