// @flow
import React, { Component } from 'react';
import SearchView from './SearchView';

type Props = {
    setSearchState: Function,
    searchState: {
        selectedLayer: string,
        textSearch: string,
        searchFieldValues: Array<Object>,
        optionsField: any,
        optionsExpression: Array<Object>,
        fetching: boolean,
        suggestions: Array<string>,
        suggestionsActive: boolean,
    },
    activeSearch: string,
    setActiveSearch: (activeSearch: string) => void,
};

class Search extends Component<Props, null> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.toggleSearchSuggestions = this.toggleSearchSuggestions.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    toggleSearchSuggestions = () => {
        const { setSearchState } = this.props;
        const {
            selectedLayer,
            textSearch,
            searchFieldValues,
            suggestions,
            suggestionsActive,
        } = this.props.searchState;

        setSearchState(
            selectedLayer,
            textSearch,
            searchFieldValues,
            suggestions,
            !suggestionsActive,
        );
    };

    handleRadioChange = (evt: Object) => {
        const { setActiveSearch } = this.props;
        setActiveSearch(evt.target.value);
    };

    render() {
        const { searchState, activeSearch } = this.props;

        return (
            <SearchView
                suggestionsActive={searchState.suggestionsActive}
                toggleSearchSuggestions={this.toggleSearchSuggestions}
                handleRadioChange={this.handleRadioChange}
                activeSearch={activeSearch}
            />
        );
    }
}

export default Search;
