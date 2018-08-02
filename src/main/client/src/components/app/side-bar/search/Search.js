// @flow
import React, { Component } from 'react';
import { parseQueryString } from '../../../../utils/search/parseQueryString';
import SearchView from './SearchView';
import { fetchSearchSuggestions } from '../../../../api/search/searchQuery';

type Props = {
    searchFeatures: Function,
    setSearchState: Function,
    setSearchOptions: Function,
    layerList: Array<Object>,
    allQueryableLayers: any,
    activeQueryableLayers: any,
    queryOptions: any,
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
};

type State = {
    fetchingSuggestions: boolean,
    suggestionQuery: number,
};

const initialState = {
    fetchingSuggestions: false,
    suggestionQuery: 0,
};

class Search extends Component<Props, State> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };

        this.handleLayerChange = this.handleLayerChange.bind(this);
        this.handleAddField = this.handleAddField.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleFieldBlur = this.handleFieldBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemoveField = this.handleRemoveField.bind(this);
        this.toggleSearchSuggestions = this.toggleSearchSuggestions.bind(this);
    }

    componentDidMount() {
        const { activeQueryableLayers, setSearchState } = this.props;
        const { selectedLayer, suggestionsActive } = this.props.searchState;

        if (selectedLayer && selectedLayer !== 'queryAll' && selectedLayer !== 'queryActive' &&
            !activeQueryableLayers.find(ql => ql.value === selectedLayer)) {
            setSearchState(0, '', [], [], suggestionsActive);
        }
    }

    handleLayerChange = (layerId: string) => {
        const { setSearchState, setSearchOptions, layerList } = this.props;
        const { suggestionsActive } = this.props.searchState;
        setSearchState(layerId, '', [], [], suggestionsActive);
        if (layerId && layerId !== 'queryAll' && layerId !== 'queryActive') {
            setSearchOptions(layerId, layerList);
        }
    };

    handleTextChange = (evt: Object) => {
        const { setSearchState } = this.props;
        const {
            selectedLayer,
            searchFieldValues,
            suggestionsActive,
        } = this.props.searchState;

        setSearchState(
            selectedLayer,
            evt.target.value,
            searchFieldValues,
            [],
            suggestionsActive,
        );
    };

    handleAddField = (layerId: string) => {
        const { setSearchState } = this.props;
        const {
            optionsField,
            searchFieldValues,
            selectedLayer,
            textSearch,
            suggestionsActive,
        } = this.props.searchState;

        const newField = {
            id: searchFieldValues.length,
            name: optionsField.find(a => a.value === layerId).label,
            queryExpression: '%',
            queryText: '',
        };
        const searchFields = [...searchFieldValues, newField]
            .map((field, index) => ({ ...field, id: index }));

        setSearchState(
            selectedLayer,
            textSearch,
            searchFields,
            [],
            suggestionsActive,
        );
    };

    handleChangeField = (type: string, evt: Object, index: number) => {
        const { setSearchState } = this.props;
        const { selectedLayer, textSearch, suggestionsActive } = this.props.searchState;

        const searchFieldValues = [
            ...this.props.searchState.searchFieldValues,
        ];

        switch (type) {
            case 'text': {
                searchFieldValues[index].queryText = evt.target.value;
                if (suggestionsActive) {
                    const text = `'${evt.target.value}%'`;
                    const queryColumn = searchFieldValues[index].name;
                    const queryString = `${queryColumn} LIKE ${text}`;
                    window.clearTimeout(this.state.suggestionQuery);
                    if (this.abortController) {
                        this.abortController.abort();
                    }
                    if (evt.target.value.trim().length > 0) {
                        this.setState({
                            // Workaround for IE since it does not support aborting yet at least.
                            fetchingSuggestions: true,
                            suggestionQuery: window.setTimeout(() => {
                                const signal = this.abortController != null ?
                                    this.abortController.signal : undefined;

                                fetchSearchSuggestions(
                                    selectedLayer,
                                    queryString,
                                    queryColumn,
                                    signal,
                                ).then((suggestions) => {
                                    if (suggestions) {
                                        // Sort array and remove duplicates.
                                        const sortedSuggestions = suggestions
                                            .sort()
                                            .filter((elem, ind, array) =>
                                                ind === array.indexOf(elem));

                                        this.props.setSearchState(
                                            selectedLayer,
                                            textSearch,
                                            searchFieldValues,
                                            sortedSuggestions,
                                            suggestionsActive,
                                        );
                                    }
                                    this.setState({ fetchingSuggestions: false });
                                });
                            }, 200),
                        });
                    }
                }
                break;
            }
            case 'expression':
                searchFieldValues[index].queryExpression = evt;
                break;
            default:
                break;
        }

        if (!this.state.fetchingSuggestions) {
            setSearchState(
                selectedLayer,
                textSearch,
                searchFieldValues,
                [],
                suggestionsActive,
            );
        }
    };

    handleFieldBlur = () => {
        if (this.abortController != null) {
            this.abortController.abort();
        }
    };

    handleRemoveField = (index: number) => {
        const { setSearchState } = this.props;
        const { selectedLayer, textSearch, suggestionsActive } = this.props.searchState;

        const searchFieldValues = [
            ...this.props.searchState.searchFieldValues,
        ];

        searchFieldValues.splice(index, 1);
        setSearchState(selectedLayer, textSearch, searchFieldValues, [], suggestionsActive);
    };

    handleSubmit = (evt: Object) => {
        evt.preventDefault();
        const { searchFeatures, allQueryableLayers, activeQueryableLayers } = this.props;
        const {
            selectedLayer,
            searchFieldValues,
            textSearch,
            optionsField,
        } = this.props.searchState;

        const buildQueryString = layer =>
            parseQueryString(
                searchFieldValues,
                textSearch,
                optionsField,
                layer.queryColumns,
            );

        const queryMap = new Map();
        if (selectedLayer === 'queryAll') {
            allQueryableLayers.forEach((layer) => {
                queryMap.set(layer, buildQueryString(layer));
            });
        } else if (selectedLayer === 'queryActive') {
            activeQueryableLayers.forEach((layer) => {
                queryMap.set(layer, buildQueryString(layer));
            });
        } else {
            const layer = activeQueryableLayers.find(ql => ql.value === selectedLayer);
            queryMap.set(layer, buildQueryString(layer));
        }

        searchFeatures(queryMap);
    };

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

    render() {
        const {
            selectedLayer,
            searchFieldValues,
            textSearch,
            optionsField,
            optionsExpression,
            fetching,
            suggestions,
            suggestionsActive,
        } = this.props.searchState;
        const { setSearchState, queryOptions } = this.props;

        return (
            <SearchView
                handleLayerChange={this.handleLayerChange}
                handleAddField={this.handleAddField}
                handleChangeField={this.handleChangeField}
                handleFieldBlur={this.handleFieldBlur}
                handleSubmit={this.handleSubmit}
                handleTextChange={this.handleTextChange}
                handleRemoveField={this.handleRemoveField}
                setSearchState={setSearchState}
                selectedLayer={selectedLayer}
                queryableLayers={queryOptions}
                searchFieldValues={searchFieldValues}
                textSearch={textSearch}
                optionsField={optionsField}
                optionsExpression={optionsExpression}
                fetching={fetching}
                suggestions={suggestions}
                suggestionsActive={suggestionsActive}
                toggleSearchSuggestions={this.toggleSearchSuggestions}
            />
        );
    }
}

export default Search;
