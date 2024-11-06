import { CommonRegExps } from "../../public/api/shared.variables.mjs";
import { Services } from "../services.jsx";

export class searchParameters{
    /** Values entered in the searchbar */
    values = [''];
    /** The list of options the searchbar can set */
    options = {
        /** Defines whether the regular expression feature is enabled or not */
        regularExpressions : true,
        /** Defines whether the filter exclude the entered values or not */
        revertSelection : false
    }

    /**
     * Research algorithm
     * @param {*} source data to filter
     * @returns boolean to notify if the tab should be filtered
     */
    filter(tab){
        let searchText = `"${tab.title} ${tab.url} ${tab.domain ?? ""}"`.toLowerCase();
        let doesMatch = false;
        let solved = false;
        
        // Check if a least a value matches (OR)
        for(let value of this.values){
           // Check if there is a match
            if(solved){
                continue;
            }else{
                // check if the value starts with an exclamation mark. 
                // If so the condition of match is reversed
                let startsWithBang = value[0] === "!";

                // Consider a match until the value to escape is found
                if(startsWithBang){
                    value = value.slice(1);
                    doesMatch = true;
                }

                // Check if the filter value is empty
                if(value === "" ){
                    //Check if it is the only filter
                    if( this.values.length === 1){
                        doesMatch = !startsWithBang;
                        solved = true;
                    }
                }else{
                    //Check if we can found this filter value in the tab information
                    if(searchText.indexOf(value.toLowerCase()) != -1){
                        doesMatch = !startsWithBang;
                        solved = true;
                    }
                }
            }
        }

        return doesMatch;
    }


    /**
     * Clear values from filter
     */
    clearValues(){
        this.values = [''];
    }

    /**
     * Get the array of filters linked to the alias
     * @param {string} enteredText 
     * @returns 
     */
    getFilterForAlias(enteredText){
        let isReversed = enteredText.match(CommonRegExps.SEARCH_NEGATION) != null;
        
        let alias = enteredText.split(':')[1];
        if (Services.data.hasAlias(alias)) {
            let valuesForAlias = Services.data.getValuesForAlias(alias);

            if(isReversed){
                valuesForAlias = valuesForAlias.map(value=>`!${value}`);
            }
            return valuesForAlias;
        } else {
           return [];
        }
    }

    /**
     * Add a value to the research filters
     * @param {*} enteredText 
     */
    addValue(enteredText){
        // Check if the entered value is an alias
        if(enteredText.match(CommonRegExps.SEARCH_ALIASES) != null){
            //Remove the alias for the list of values
            this.values.pop();

            this.values = this.values.concat(
                this.getFilterForAlias(enteredText));
            // Prepare for the next value
            this.values.push("");
        }else{
            // Keep the entered value and prepare the next one
            this.values.push("");
        }
    }

    /**
     * Remove a value from research
     * @param {*} index 
     */
    removeValue(index){
        this.values.splice(index,1);
    }
}