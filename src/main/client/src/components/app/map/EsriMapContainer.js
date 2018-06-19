// @flow
import { connect } from 'react-redux';
import EsriMap from './EsriMap';

import { selectFeatures } from './../../../reducers/table/actions';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching || state.map.mapConfig.fetching,
    isOpenTable: state.table.toggleTable,
    mapCenter: state.map.mapConfig.mapCenter,
    mapScale: state.map.mapConfig.mapScale,
});

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
