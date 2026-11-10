import { CommonRegExps } from "../../public/api/shared.variables.mjs";
import { Services } from "../services.jsx";

export class searchParameters {
    /** Values entered in the searchbar */
    values = [''];
    /** The list of options the searchbar can set */
    options = {
        /** Defines whether the regular expression feature is enabled or not */
        regularExpressions: true,
        /** Defines whether the filter exclude the entered values or not */
        revertSelection: false
    }

    isEmpty(){
        return this.values[0] == '' 
            && this.values.length == 1;

    }

    /**
     * Research algorithm
     * @param {*} source data to filter
     * @returns boolean to notify if the tab should be filtered
     */
    filter(tab) {
        //Directly skip if the value is empty
        if (this.isEmpty()) return true;

        //Text on which the filter is going to find a match
        let searchText = `"${tab.title} ${tab.url}"`.toLowerCase();
        // States the match of one of the filters on the current searchText
        let doesMatch = false;
        // States the end of a research
        let solved = false;

        
        //Limit number of iterations
        let iteration = 0;
        // Check if a least a value matches (OR)
        while (!solved && iteration < this.values.length) {
            let value = this.values[iteration];

            if(value == "") {
                iteration++;
                continue;
            }

            // Search for a match
            // check if the value starts with an exclamation mark. 
            // If so the condition of match is reversed
            let startsWithBang = value[0] === "!";

            // Consider a match until the value to escape is found
            if (startsWithBang) {
                value = value.slice(1);
                doesMatch = true;
            }


            //Check if we can found this filter value in the tab information
            if (searchText.indexOf(value.toLowerCase()) != -1) {
                doesMatch = !startsWithBang;
                solved = true;
            }


            iteration++;
        }

        return doesMatch;
    }


    /**
     * Clear values from filter
     */
    clearValues() {
        this.values = [''];
    }

    /**
     * Get the array of filters linked to the alias
     * @param {string} enteredText 
     * @returns 
     */
    getFilterForAlias(enteredText) {
        CommonRegExps.SEARCH_ALIASES.test(enteredText);
        let alias = RegExp.$1;
        let isReversed = enteredText[1] == "!";
        if (Services.data.hasAlias(alias)) {
            let valuesForAlias = Services.data.getValuesForAlias(alias);

            if (isReversed) {
                valuesForAlias = valuesForAlias.map(value => `!${value}`);
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
    addValue(enteredText) {
        // Check if the entered value is an alias
        if (enteredText.match(CommonRegExps.SEARCH_ALIASES) != null) {
            //Remove the alias for the list of values
            this.values.pop();

            this.values = this.values.concat(
                this.getFilterForAlias(enteredText));
            // Prepare for the next value
            this.values.push("");
        } else {
            // Keep the entered value and prepare the next one
            this.values.push("");
        }
    }

    /**
     * Remove a value from research
     * @param {*} index 
     */
    removeValue(index) {
        this.values.splice(index, 1);
    }
}