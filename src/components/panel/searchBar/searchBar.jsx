import React, { Component } from "react";
import { searchParameters } from "../../../models/searchFilter.model.js";
import Chip from "../../element/chip/chip.jsx";
import { t } from "i18next";
import "./searchBar.css";
import { AliasAutocompleter } from "../../element/aliasAutocompleter/aliasAutocompleter.jsx";
import { Services } from "../../../services.jsx";
import { icons } from "../../../../public/api/shared.variables.mjs";

export class SearchBarPanel extends Component {
    /** Parameters linked to the searchbar */
    params = new searchParameters();

    /**
 * Constructor
 * @param {Object} props Component's attributes
 */
    constructor(props) {
        super(props);

        this.state = {
            searchbarContent: ""
        };

        this.setValue = this.setValue.bind(this);
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.clear = this.clear.bind(this);
    }

    /**
     * Set a value
     * @param {string} value Text entered in the searchbar
     */
    setValue(value) {
        let lastIndex = this.params.values.length - 1;
        this.setState({
            searchbarContent: value
        })
        this.params.values[lastIndex] = value;
        this.updateFilter();
    }

    /**
     * Update the searchbar filter in the other components
     */
    updateFilter() {
        this.props.onFilter(this.params);
    }

    /**
     * Add a filter value
     * @param {*} event 
     * @returns 
     */
    addValue(event) {
        let processInput = (value) => {
            this.clearSearchbar();
            this.params.addValue(value)

            this.updateFilter();
        };

        if (event.keyCode == 13) {
            processInput(event.target.value);
        }
        else if (event.keyCode == 9) {
            const { aliases, list, meta } = Services.data.getAliasesFiltered(this.params);
            let firstAlias = list[0];
            //Do nothing if there are no matching aliases
            if (!firstAlias || firstAlias == "") {
                return;
            }

            const entry = (meta.reversed) ?
                `:!${firstAlias}` : `:${firstAlias}`;

            processInput(entry);

            // Prevent the default tab behavior
            event.preventDefault();
        }
    }

    /**
     * Remove a filter value by index
     * @param {*} index Index of the value
     */
    removeValue(index) {
        this.params.removeValue(index);
        this.updateFilter();
    }

    /**
     * Remove all filter values
     */
    clear() {
        this.params.clearValues();
        this.clearSearchbar();
        this.updateFilter();
    }

    /**
     * Reset the searchbar input
     */
    clearSearchbar() {
        this.setState({
            searchbarContent: ""
        })
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render() {
        let valueChips = this.params.values.map((value, index) => {
            if (value != '' && index != this.params.values.length - 1) {
                return <Chip key={index} onRemove={() => this.removeValue(index)}
                    value={value}>
                </Chip>
            }
        });

        let icon = (this.params.isEmpty())? icons.search: icons.editClear;

        return <section id="searchbox" className={(this.params.values.length > 1) ? 'asValues' : ''}>
            <div>
                {valueChips}
                <div className="actionPill">

                </div>
            </div>
            <div className="searchbar">
                <input type="text" value={this.state.searchbarContent}
                    placeholder={t("common.search")}
                    onChange={(e) => this.setValue(e.target.value)}
                    onKeyDown={this.addValue}></input>
                <div className="actions">
                    <img className="monochrome-svg" src={icon} onClick={this.clear}/>
                </div>
            </div>
            <AliasAutocompleter filter={this.params}></AliasAutocompleter>
        </section>
    }
}