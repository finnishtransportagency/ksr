// @flow
import { connect } from 'react-redux';
import SearchProperty from './SearchProperty';
import { setPropertyInfo, clearProperties } from '../../../../../reducers/search/actions';

const mapStateToProps = state => ({
    features: state.search.propertyInfo.features,
    fetching: state.search.propertyInfo.fetching,
    view: state.map.mapView.view,
    authorities: state.user.userInfo.authorities,
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: (propertyId, view, graphicId, authorities) => {
        dispatch(setPropertyInfo(propertyId, view, graphicId, authorities));
    },
    handleClear: (graphicId, view) => {
        dispatch(clearProperties(graphicId, view));
    },
});

const SearchPropertyContainer = (connect(mapStateToProps, mapDispatchToProps)(SearchProperty): any);

export default SearchPropertyContainer;
