// @flow
import { connect } from 'react-redux';
import SearchPropertyView from './SearchPropertyView';

const mapStateToProps = state => ({
    propertyId: state.search.propertyInfo.id,
    properties: state.search.propertyInfo.properties,
    links: state.search.propertyInfo.links,
    fetching: state.search.propertyInfo.fetching,
    fetchingLinks: state.search.propertyInfo.fetchingLinks,
});

const SearchPropertyContainer = connect(mapStateToProps, null)(SearchPropertyView);

export default SearchPropertyContainer;
