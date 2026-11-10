import './aliasAutocompleter.css';
import React from "react";
import { t } from "i18next";

import { Services } from '../../../services.jsx';

export class AliasAutocompleter extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Render function
     * @returns 
     */
    render() {
        const {aliases,list,meta} = Services.data.getAliasesFiltered(this.props.filter);
        let reversed = meta.reversed;

        let aliasList = list.map(alias => {
                return <li key={alias}>
                    <b>:{reversed && <>!</>}{alias}</b> - {reversed && <i>{t("searchbar.aliases.notin")}</i>} {aliases[alias].description}</li>
            })

        return <ul className='kt-component kt-component-alias-autocompleter'>
            {aliasList}
        </ul>
    }
}