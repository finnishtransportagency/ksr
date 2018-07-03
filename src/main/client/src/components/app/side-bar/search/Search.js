// @flow
import React, { Component } from 'react';
import { parseQueryString } from '../../../../utils/search/parseQueryString';
import SearchView from './SearchView';

type Props = {
    searchFeatures: Function,
    setSearchState: Function,
    setSearchOptions: Function,
    layerList: Array<Object>,
    queryableLayers: Array<Object>,
    searchState: {
        selectedLayer: number,
        textSearch: string,
        searchFieldValues: Array<Object>,
        optionsField: any,
        optionsExpression: Array<Object>,
        fetching: boolean,
    },
};

type State = {
    /* ... */
};

class Search extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleLayerChange = this.handleLayerChange.bind(this);
        this.handleAddField = this.handleAddField.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemoveField = this.handleRemoveField.bind(this);
    }

    handleLayerChange = (layerId: number) => {
        const { setSearchState, setSearchOptions, layerList } = this.props;
        setSearchState(layerId, '', []);
        if (layerId) setSearchOptions(layerId, layerList);
    };

    handleTextChange = (evt: Object) => {
        const { setSearchState } = this.props;
        const {
            selectedLayer,
            searchFieldValues,
        } = this.props.searchState;

        setSearchState(
            selectedLayer,
            evt.target.value,
            searchFieldValues,
        );
    };

    handleAddField = (layerId: number) => {
        const { setSearchState } = this.props;
        const {
            optionsField,
            searchFieldValues,
            selectedLayer,
            textSearch,
        } = this.props.searchState;

        const newField = {
            id: searchFieldValues.length,
            name: optionsField.find(a => a.value === layerId).label,
            queryExpression: '%',
            queryText: '',
        };

        setSearchState(
            selectedLayer,
            textSearch,
            [...searchFieldValues, newField],
        );
    };

    handleChangeField = (type: string, evt: Object, index: number) => {
        const { setSearchState } = this.props;
        const { selectedLayer, textSearch } = this.props.searchState;

        const searchFieldValues = [
            ...this.props.searchState.searchFieldValues,
        ];

        switch (type) {
            case 'text':
                searchFieldValues[index].queryText = evt.target.value;
                break;
            case 'expression':
                searchFieldValues[index].queryExpression = evt;
                break;
            default:
                break;
        }

        setSearchState(
            selectedLayer,
            textSearch,
            searchFieldValues,
        );
    };

    handleRemoveField = (index: number) => {
        const { setSearchState } = this.props;
        const { selectedLayer, textSearch } = this.props.searchState;

        const searchFieldValues = [
            ...this.props.searchState.searchFieldValues,
        ];

        searchFieldValues.splice(index, 1);
        setSearchState(selectedLayer, textSearch, searchFieldValues);
    };

    handleSubmit = (evt: Object) => {
        evt.preventDefault();
        const { searchFeatures } = this.props;
        const {
            selectedLayer,
            searchFieldValues,
            textSearch,
            optionsField,
        } = this.props.searchState;

        const queryString: string = parseQueryString(
            searchFieldValues,
            textSearch,
            optionsField,
        );

        searchFeatures(selectedLayer, queryString);
    };

    render() {
        const {
            selectedLayer,
            searchFieldValues,
            textSearch,
            optionsField,
            optionsExpression,
            fetching,
        } = this.props.searchState;
        const { queryableLayers } = this.props;

        return (
            <SearchView
                handleLayerChange={this.handleLayerChange}
                handleAddField={this.handleAddField}
                handleChangeField={this.handleChangeField}
                handleSubmit={this.handleSubmit}
                handleTextChange={this.handleTextChange}
                handleRemoveField={this.handleRemoveField}
                selectedLayer={selectedLayer}
                queryableLayers={queryableLayers}
                searchFieldValues={searchFieldValues}
                textSearch={textSearch}
                optionsField={optionsField}
                optionsExpression={optionsExpression}
                fetching={fetching}
            />
        );
    }
}

export default Search;
