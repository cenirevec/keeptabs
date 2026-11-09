import './aliasAutocompleter.css';
import React from "react";
import { t } from "i18next";

import { Services } from '../../../services.jsx';

export class AliasAutocompleter extends React.Component {
    constructor(props) {
        super(props);
    }

    renderAliasesList(input) {
        let aliases = Services.data.getAliases();

        let reversed = input.indexOf("!") == 0

        let list = Object.keys(aliases)
            .filter(x => x.indexOf(input.replace("!", "")) != -1)
            .map(alias => {
                return <li key={alias}>
                    <b>:{reversed && <>!</>}{alias}</b> - {reversed && <i>{t("searchbar.aliases.notin")}</i>} {aliases[alias].description}</li>
            })

        return <ul className='kt-component kt-component-alias-autocompleter'>
            {list}
        </ul>
    }

    render() {
        let input = this.props.filter.values[this.props.filter.values.length - 1];
        let lastTypeAlias = /:(!?[^:]*)$/g.test(input);

        return this.renderAliasesList(RegExp.$1);
    }
}