// @flow
import { connect } from 'react-redux';
import SearchProperty from './SearchProperty';
import { setPropertyInfo, clearProperties } from '../../../../../reducers/search/actions';

const mapStateToProps = (state: Object) => ({
    features: state.search.propertyInfo.features,
    fetching: state.search.propertyInfo.fetching,
    view: state.map.mapView.view,
    authorities: state.user.userInfo.authorities,
});

const mapDispatchToProps = (dispatch: Function) => ({
    handleSubmit: (propertyId: any, view: any, graphicId: any, authorities: any) => {
        dispatch(setPropertyInfo(propertyId, view, graphicId, authorities));
    },
    handleClear: (graphicId: any, view: any) => {
        dispatch(clearProperties(graphicId, view));
    },
});

const SearchPropertyContainer = (connect(mapStateToProps, mapDispatchToProps)(SearchProperty): any);

export default SearchPropertyContainer;
