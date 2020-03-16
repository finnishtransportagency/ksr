// @flow
import React, { Component } from 'react';
import { parseQueryString, searchFieldIsNumber } from '../../../../../utils/search/parseQueryString';
import SearchLayerView from './SearchLayerView';
import { fetchSearchSuggestions } from '../../../../../api/search/searchQuery';
import { filterNotAllowedFields } from '../../../../../utils/fields';
import { nestedVal } from '../../../../../utils/nestedValue';

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

class SearchLayer extends Component<Props, State> {
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
    }

    componentDidMount() {
        const { activeQueryableLayers, setSearchState, searchState } = this.props;
        const { selectedLayer, suggestionsActive } = searchState;

        if (selectedLayer && selectedLayer !== 'queryAll' && selectedLayer !== 'queryActive'
            && !activeQueryableLayers.find(ql => ql.value === selectedLayer)) {
            setSearchState(0, '', [], [], suggestionsActive);
        }
    }

    handleLayerChange = (layerId: string) => {
        const {
            setSearchState, setSearchOptions, layerList, searchState,
        } = this.props;
        const { suggestionsActive } = searchState;
        setSearchState(layerId, '', [], [], suggestionsActive);
        if (layerId && layerId !== 'queryAll' && layerId !== 'queryActive') {
            const isParentLayer = layerList.some(layer => layer && layer.parentLayer === layerId);
            if (isParentLayer) {
                setSearchOptions(
                    nestedVal(layerList.find(layer => layer.parentLayer === layerId), ['id']),
                    layerList,
                );
            } else {
                setSearchOptions(layerId, layerList);
            }
        }
    };

    handleTextChange = (evt: Object) => {
        const { setSearchState, searchState } = this.props;
        const { selectedLayer, searchFieldValues, suggestionsActive } = searchState;

        setSearchState(
            selectedLayer,
            evt.target.value,
            searchFieldValues,
            [],
            suggestionsActive,
        );
    };

    handleAddField = (layerId: string) => {
        const { setSearchState, searchState } = this.props;
        const {
            optionsField,
            searchFieldValues,
            selectedLayer,
            textSearch,
            suggestionsActive,
        } = searchState;

        const field = optionsField.find(a => a.value === layerId);

        const newField = {
            id: searchFieldValues.length,
            name: field.name,
            label: field.label,
            queryExpression: searchFieldIsNumber(field.type)
                ? '='
                : 'LIKE',
            queryText: '',
            queryDate: '',
            type: field.type,
            domain: field.domain,
        };
        const searchFields = [...searchFieldValues, newField]
            .map((f, index) => ({ ...f, id: index }));

        setSearchState(
            selectedLayer,
            textSearch,
            searchFields,
            [],
            suggestionsActive,
        );
    };

    handleChangeField = (type: string, evt: Object, index: number) => {
        const { suggestionQuery, fetchingSuggestions } = this.state;
        const { setSearchState, searchState } = this.props;
        const { selectedLayer, textSearch, suggestionsActive } = searchState;

        const searchFieldValues = [
            ...searchState.searchFieldValues,
        ];

        switch (type) {
            case 'text': {
                searchFieldValues[index].queryText = evt.target.value;
                if (suggestionsActive) {
                    const text = `'${evt.target.value}%'`;
                    const queryColumn = searchFieldValues[index].name;
                    const queryString = `LOWER(${queryColumn}) LIKE LOWER(${text})`;
                    window.clearTimeout(suggestionQuery);
                    if (this.abortController) {
                        this.abortController.abort();
                    }
                    if (evt.target.value.trim().length > 0) {
                        this.setState({
                            // Workaround for IE since it does not support aborting yet at least.
                            fetchingSuggestions: true,
                            suggestionQuery: window.setTimeout(() => {
                                const signal = this.abortController != null
                                    ? this.abortController.signal : undefined;

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
                                            .filter((elem, ind, array) => (
                                                ind === array.indexOf(elem)
                                            ));

                                        setSearchState(
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
            case 'codedValue':
                searchFieldValues[index].queryText = evt;
                break;
            case 'date':
                searchFieldValues[index].queryDate = evt.target.value;
                break;
            default:
                break;
        }

        if (!fetchingSuggestions) {
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
        const { setSearchState, searchState } = this.props;
        const { selectedLayer, textSearch, suggestionsActive } = searchState;

        const searchFieldValues = [
            ...searchState.searchFieldValues,
        ];

        searchFieldValues.splice(index, 1);
        setSearchState(selectedLayer, textSearch, searchFieldValues, [], suggestionsActive);
    };

    handleSubmit = (evt: Object) => {
        evt.preventDefault();
        const {
            searchFeatures, allQueryableLayers, activeQueryableLayers, searchState, layerList,
        } = this.props;
        const {
            selectedLayer,
            searchFieldValues,
            textSearch,
            optionsField,
        } = searchState;

        const buildQueryString = (layer: Object) => {
            let queryFields = layer.queryColumnsList;
            const fieldsToQuery = filterNotAllowedFields(layer.fields).map(ff => ff.name);

            // if layer has fields defined then use them to build query
            // if not then use query column list
            if (fieldsToQuery.length > 0) {
                queryFields = fieldsToQuery;
            }

            return parseQueryString(
                searchFieldValues,
                textSearch,
                optionsField,
                queryFields,
            );
        };

        const queryMap = new Map();
        if (selectedLayer === 'queryAll') {
            allQueryableLayers
                .filter(layer => !layerList.some(ll => ll.parentLayer === layer.id))
                .forEach((layer) => {
                    queryMap.set(layer, buildQueryString(layer));
                });
        } else if (selectedLayer === 'queryActive') {
            activeQueryableLayers
                .filter(layer => !layerList.some(ll => ll.parentLayer === layer.id))
                .forEach((layer) => {
                    queryMap.set(layer, buildQueryString(layer));
                });
        } else {
            const layer = activeQueryableLayers.find(ql => ql.value === selectedLayer);
            if (layerList.some(ll => ll.parentLayer === layer.id)) {
                layerList.filter(ll => ll.parentLayer === layer.id).forEach((qLayer) => {
                    queryMap.set(qLayer, buildQueryString(qLayer));
                });
            } else {
                queryMap.set(layer, buildQueryString(layer));
            }
        }

        searchFeatures(queryMap);
    };

    render() {
        const { setSearchState, queryOptions, searchState } = this.props;
        const {
            selectedLayer,
            searchFieldValues,
            textSearch,
            optionsField,
            fetching,
            suggestions,
            suggestionsActive,
        } = searchState;

        return (
            <SearchLayerView
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
                fetching={fetching}
                suggestions={suggestions}
                suggestionsActive={suggestionsActive}
            />
        );
    }
}

export default SearchLayer;
