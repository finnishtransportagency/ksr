// @flow
import { connect } from 'react-redux';
import { searchFeatures, setActiveTable, toggleTable } from '../../../../../reducers/table/actions';
import { setSearchState, setSearchOptions } from '../../../../../reducers/search/actions';
import SearchLayer from './SearchLayer';
import strings from '../../../../../translations';
import { setActiveNav } from '../../../../../reducers/navigation/actions';

const mapStateToProps = (state: Object) => {
    const allQueryableLayers = state.map.layerGroups.layerList
        .filter(l => l.queryable && l._source !== 'search')
        .map(l => ({ ...l, value: l.id, label: l.name }));

    const activeQueryableLayers = allQueryableLayers.filter(l => l.active);
    const queryOptions = [{ value: 'queryAll', label: strings.search.allQueryableLayers }]
        .concat([{ value: 'queryActive', label: strings.search.allActiveLayers }])
        .concat(activeQueryableLayers);

    return ({
        allQueryableLayers,
        activeQueryableLayers,
        queryOptions,
        searchState: state.search.searchState,
        layerList: state.map.layerGroups.layerList,
        searchResults: state.table.features.layers.filter(l => l.id.endsWith('_s')),
        tableOpen: state.table.toggleTable,
    });
};

const mapDispatchToProps = (dispatch: Function) => ({
    searchFeatures: (queryMap: any) => {
        dispatch(searchFeatures(queryMap));
    },
    setSearchState: (layerId: any, textSearch: any, searchFieldValues: any, suggestions: any, suggestionsActive: any) => {
        dispatch(setSearchState(
            layerId,
            textSearch,
            searchFieldValues,
            suggestions,
            suggestionsActive,
        ));
    },
    setSearchOptions: (layerId: any, layerList: any) => {
        dispatch(setSearchOptions(layerId, layerList));
    },
    toggleTable: () => {
        dispatch(toggleTable());
    },
    setActiveTable: (layerId: string) => {
        dispatch(setActiveTable(layerId));
    },
    closeSideBar: () => {
        dispatch(setActiveNav('search'));
    },
});

const mergeProps = (stateToProps: any, dispatchToProps: any) => ({
    ...stateToProps,
    ...dispatchToProps,
    openSearchResultTable: (layerId: string) => {
        if (window.innerWidth <= 768) {
            dispatchToProps.closeSideBar();
        }
        if (!stateToProps.tableOpen) {
            dispatchToProps.toggleTable();
        }
        dispatchToProps.setActiveTable(layerId);
    },
});

const SearchLayerContainer = (
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchLayer): any
);

export default SearchLayerContainer;
