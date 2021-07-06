// @flow
import { connect } from 'react-redux';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import { setLayerList, toggleLayer, toggleLayerVisibleZoomOut } from '../../../../../reducers/map/actions';
import { setActiveModal } from '../../../../../reducers/modal/actions';
import MapLayersActive from './MapLayersActive';
import { showConfirmModal } from '../../../../../reducers/confirmModal/actions';
import { addNonSpatialContentToTable } from '../../../../../reducers/table/actions';

const mapStateToProps = state => ({
    mapLayerList: state.map.layerGroups.layerList.filter(l => l.type !== 'agfl'),
    dataLayerList: state.map.layerGroups.layerList.filter(l => l.type === 'agfl'),
    layersVisibleZoomOut: state.map.layerGroups.layersVisibleZoomOut,
    fetching: state.map.layerGroups.fetching,
    activeAdminTool: state.adminTool.active.layerId,
    mapScale: state.map.mapConfig.mapScale,
    tableLayers: state.table.features.layers,
    loadingLayers: state.loading.loadingLayers,
});

const mapDispatchToProps = dispatch => ({
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
    setActiveAdminTool: (layerId, layerList) => {
        dispatch(setActiveAdminTool(layerId, layerList));
    },
    createNonSpatialFeature: () => {
        dispatch(setActiveModal('editLayerDetails'));
    },
    createThemeLayer: (layerId: string) => {
        dispatch(setActiveModal('themeLayer', layerId));
    },
    toggleLayer: (layerId: string) => {
        dispatch(toggleLayer(layerId));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    addNonSpatialContentToTable: (layer) => {
        dispatch(addNonSpatialContentToTable(layer));
    },
    toggleVisibleZoomOut: (layerId, original) => {
        dispatch(toggleLayerVisibleZoomOut(layerId, original));
    },
});

const MapLayersActiveContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(MapLayersActive): any);

export default MapLayersActiveContainer;
