// @flow
import { connect } from 'react-redux';
import { setEditMode, setMapView, setTempGrapLayer } from '../../../reducers/map/actions';
import EsriMap from './EsriMap';

import { selectFeatures } from './../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const selectedFeatures = state.table.features.layers
        .reduce((a, b) => a.concat(b.data.filter(d => d._selected)), []);

    return ({
        view: state.map.mapView.view,
        activeNav: state.navigation.activeNav,
        layerList: state.map.layerGroups.layerList,
        fetching: state.map.layerGroups.fetching || state.map.mapConfig.fetching,
        isOpenTable: state.table.toggleTable,
        mapCenter: state.map.mapConfig.mapCenter,
        mapScale: state.map.mapConfig.mapScale,
        printServiceUrl: state.map.mapConfig.printServiceUrl,
        selectedFeatures,
        adminToolActive: state.adminTool.active.layerId,
        sketchViewModel: state.map.mapTools.sketchViewModel,
        editMode: state.map.mapTools.editMode,
    });
};

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    setMapView: (view) => {
        dispatch(setMapView(view));
    },
    setTempGrapLayer: (graphicsLayer) => {
        dispatch(setTempGrapLayer(graphicsLayer));
    },
    setEditMode: (editMode) => {
        dispatch(setEditMode(editMode));
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
