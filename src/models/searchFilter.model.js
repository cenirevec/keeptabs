export class searchBarParameters{
    /** Values entered in the searchbar */
    values = [''];
    /** The list of options the searchbar can set */
    options = {
        /** Defines whether the regular expression feature is enabled or not */
        regularExpressions : false,
        /** Defines whether the filter exclude the entered values or not */
        revertSelection : false
    }

    /**
     * Research algorithm
     * @param {*} source data to filter
     * @returns boolean to notify if the tab should be filtered
     */
    filter(tab){
        let searchText = `"${tab.title} ${tab.url} ${(tab.domain !=undefined)? tab.domain:""}"`;
        let doesMatch = false;
        
        // Check if a least a value matches (OR)
        this.values.forEach(value=>{
            if(value == "" ){
                if( this.values.length == 1){
                    doesMatch = true;
                }
            }else{
                //Check if the searched item matches
                if(searchText.toLowerCase().indexOf(value.toLowerCase()) != -1){
                    doesMatch = true;
                }
            }
        }) 
        return doesMatch;
    }


    /**
     * Clear values from filter
     */
    clearValues(){
        this.values = [''];
    }

    /**
     * Add a value to the research filters
     * @param {*} enteredText 
     */
    addValue(enteredText){

    }

    /**
     * Remove a value from research
     * @param {*} index 
     */
    removeValue(index){
        this.values.splice(index,1);
    }
}