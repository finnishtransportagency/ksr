// @flow
import { connect } from 'react-redux';
import { setSearchState, setActiveSearch } from '../../../../reducers/search/actions';
import Search from './Search';

const mapStateToProps = state => ({
    searchState: state.search.searchState,
    activeSearch: state.search.activeSearch,
});

const mapDispatchToProps = dispatch => ({
    setSearchState: (layerId, textSearch, searchFieldValues, suggestions, suggestionsActive) => {
        dispatch(setSearchState(
            layerId,
            textSearch,
            searchFieldValues,
            suggestions,
            suggestionsActive,
        ));
    },
    setActiveSearch: (activeSearch) => {
        dispatch(setActiveSearch(activeSearch));
    },
});

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);

export default SearchContainer;
