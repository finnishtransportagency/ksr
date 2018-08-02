// @flow
import { connect } from 'react-redux';
import { searchFeatures } from '../../../../reducers/table/actions';
import { setSearchState, setSearchOptions } from '../../../../reducers/search/actions';
import Search from './Search';
import strings from '../../../../translations';

const mapStateToProps = (state) => {
    let allQueryableLayers = [];

    if (state.adminTool.active) {
        allQueryableLayers = state.map.layerGroups.layerList
            .filter(l => l.queryable && l.id === state.adminTool.active && l._source !== 'search')
            .map(l => ({ ...l, value: l.id, label: l.name }));
    } else {
        allQueryableLayers = state.map.layerGroups.layerList
            .filter(l => l.queryable && l._source !== 'search')
            .map(l => ({ ...l, value: l.id, label: l.name }));
    }
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
    });
};

const mapDispatchToProps = dispatch => ({
    searchFeatures: (queryMap) => {
        dispatch(searchFeatures(queryMap));
    },
    setSearchState: (layerId, textSearch, searchFieldValues, suggestions) => {
        dispatch(setSearchState(layerId, textSearch, searchFieldValues, suggestions));
    },
    setSearchOptions: (layerId, layerList) => {
        dispatch(setSearchOptions(layerId, layerList));
    },
});

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);

export default SearchContainer;
