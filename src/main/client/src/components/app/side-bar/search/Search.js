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
        fetching: boolean,
        suggestions: Array<string>,
        suggestionsActive: boolean,
    },
    activeSearch: string,
    setActiveSearch: (activeSearch: string) => void,
    propertyAreaSearch: boolean,
    togglePropertyAreaSearch: Function,
};

class Search extends Component<Props, null> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.toggleSearchSuggestions = this.toggleSearchSuggestions.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    toggleSearchSuggestions = () => {
        const { setSearchState, searchState } = this.props;
        const {
            selectedLayer,
            textSearch,
            searchFieldValues,
            suggestions,
            suggestionsActive,
        } = searchState;

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
        const {
            searchState, activeSearch, propertyAreaSearch, togglePropertyAreaSearch,
        } = this.props;

        return (
            <SearchView
                suggestionsActive={searchState.suggestionsActive}
                toggleSearchSuggestions={this.toggleSearchSuggestions}
                handleRadioChange={this.handleRadioChange}
                activeSearch={activeSearch}
                propertyAreaSearch={propertyAreaSearch}
                togglePropertyAreaSearch={togglePropertyAreaSearch}
            />
        );
    }
}

export default Search;
