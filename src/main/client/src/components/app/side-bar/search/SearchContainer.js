// @flow
import { connect } from 'react-redux';
import { setSearchState, setActiveSearch, togglePropertyAreaSearch } from '../../../../reducers/search/actions';
import Search from './Search';

const mapStateToProps = (state: Object) => ({
    searchState: state.search.searchState,
    activeSearch: state.search.activeSearch,
    propertyAreaSearch: state.search.propertyInfo.propertyAreaSearch,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setSearchState: (layerId: any, textSearch: any, searchFieldValues: any, suggestions: any, suggestionsActive: any) => {
        dispatch(setSearchState(
            layerId,
            textSearch,
            searchFieldValues,
            suggestions,
            suggestionsActive,
        ));
    },
    setActiveSearch: (activeSearch: any) => {
        dispatch(setActiveSearch(activeSearch));
    },
    togglePropertyAreaSearch: () => {
        dispatch(togglePropertyAreaSearch());
    },
});

const SearchContainer = (connect(mapStateToProps, mapDispatchToProps)(Search): any);

export default SearchContainer;
