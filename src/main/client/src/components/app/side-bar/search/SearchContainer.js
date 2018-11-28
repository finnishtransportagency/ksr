// @flow
import { connect } from 'react-redux';
import { setSearchState, setActiveSearch, togglePropertyAreaSearch } from '../../../../reducers/search/actions';
import Search from './Search';

const mapStateToProps = state => ({
    searchState: state.search.searchState,
    activeSearch: state.search.activeSearch,
    propertyAreaSearch: state.search.propertyInfo.propertyAreaSearch,
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
    togglePropertyAreaSearch: () => {
        dispatch(togglePropertyAreaSearch());
    },
});

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);

export default SearchContainer;
