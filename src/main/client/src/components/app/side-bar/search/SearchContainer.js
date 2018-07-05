// @flow
import { connect } from 'react-redux';
import { searchFeatures } from '../../../../reducers/table/actions';
import { setSearchState, setSearchOptions } from '../../../../reducers/search/actions';
import Search from './Search';

const mapStateToProps = (state) => {
    const queryableLayers = state.map.layerGroups.layerList
        .filter(l => l.visible && l.active && l.queryable)
        .map(l => ({ ...l, value: l.id, label: l.name }));

    return ({
        queryableLayers,
        searchState: state.search.searchState,
        layerList: state.map.layerGroups.layerList,
    });
};

const mapDispatchToProps = dispatch => ({
    searchFeatures: (selectedLayer, queryString) => {
        dispatch(searchFeatures(selectedLayer, queryString));
    },
    setSearchState: (layerId, textSearch, searchFieldValues) => {
        dispatch(setSearchState(layerId, textSearch, searchFieldValues));
    },
    setSearchOptions: (layerId, layerList) => {
        dispatch(setSearchOptions(layerId, layerList));
    },
});

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);

export default SearchContainer;
