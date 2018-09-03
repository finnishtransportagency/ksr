// @flow
import { connect } from 'react-redux';
import { setEditMode, setMapView, setTempGraphicsLayer } from '../../../reducers/map/actions';
import EsriMap from './EsriMap';

import { selectFeatures, setSingleLayerGeometry } from './../../../reducers/table/actions';
import { setActiveModal } from '../../../reducers/modal/actions';

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
        layers: state.table.features.layers,
        activeTool: state.map.mapTools.active,
    });
};

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    setMapView: (view) => {
        dispatch(setMapView(view));
    },
    setTempGraphicsLayer: (graphicsLayer) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setEditMode: (editMode) => {
        dispatch(setEditMode(editMode));
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    setSingleLayerGeometry: (geometry) => {
        dispatch(setSingleLayerGeometry(geometry));
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
