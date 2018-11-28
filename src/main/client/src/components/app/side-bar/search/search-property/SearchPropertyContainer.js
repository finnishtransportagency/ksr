// @flow
import { connect } from 'react-redux';
import SearchProperty from './SearchProperty';

const mapStateToProps = state => ({
    features: state.search.propertyInfo.features,
    fetching: state.search.propertyInfo.fetching,
});

const SearchPropertyContainer = connect(mapStateToProps, null)(SearchProperty);

export default SearchPropertyContainer;
