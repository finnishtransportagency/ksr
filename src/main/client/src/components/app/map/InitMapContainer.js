// @flow
import { connect } from 'react-redux';
import {
    setMapView,
    setTempGraphicsLayer,
    setHasGraphics,
    setActiveFeatureMode,
    activateLayers,
    deactivateLayer,
    setScale,
} from '../../../reducers/map/actions';
import { setActiveModal } from '../../../reducers/modal/actions';
import { setPropertyInfo } from '../../../reducers/search/actions';
import { setSingleLayerGeometry, selectFeatures } from '../../../reducers/table/actions';
import { setWorkspace, setWorkspaceRejected } from '../../../reducers/workspace/actions';
import InitMap from './InitMap';
import { setContractListInfo } from '../../../reducers/contract/actions';
import { showConfirmModal } from '../../../reducers/confirmModal/actions';
import { removeLoading } from '../../../reducers/loading/actions';
import { setActiveNav } from '../../../reducers/navigation/actions';

const mapStateToProps = (state) => {
    const { layers } = state.table.features;
    const geometryDataSelected = layers
        .flatMap(f => f.data.filter(d => d._selected && d.geometry));

    let selectedLayerIds = geometryDataSelected.map(layer => layer._layerId);
    selectedLayerIds = [...new Set(selectedLayerIds)];

    const printSelectedLayers = {
        layers: selectedLayerIds.map(layerId => ({
            layerId,
            objectIds: geometryDataSelected
                .filter(layer => layer._layerId === layerId)
                .map(feature => feature._id),
        })),
    };

    const printServiceUrl = printSelectedLayers.layers.length > 0
        ? `${state.map.mapConfig.printServiceUrl}?printSelectedLayers=${JSON.stringify(printSelectedLayers)}`
        : `${state.map.mapConfig.printServiceUrl}?printSelectedLayers=${JSON.stringify({})}`;

    return {
        layerList: state.map.layerGroups.layerList,
        mapCenter: state.map.mapConfig.mapCenter,
        mapScale: state.map.mapConfig.mapScale,
        printServiceUrl,
        activeAdminTool: state.adminTool.active.layerId,
        sketchViewModel: state.map.mapTools.sketchViewModel,
        geometryType: state.adminTool.active.geometryType,
        activeTool: state.map.mapTools.active,
        initialLoading: state.map.mapConfig.fetching || state.map.layerGroups.fetching,
        authorities: state.user.userInfo.authorities,
        editModeActive: state.map.mapTools.activeFeatureMode === 'edit',
    };
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
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    setSingleLayerGeometry: (geometry) => {
        dispatch(setSingleLayerGeometry(geometry));
    },
    setHasGraphics: (hasGraphics) => {
        dispatch(setHasGraphics(hasGraphics));
    },
    setWorkspace: () => {
        dispatch(setWorkspace());
    },
    setWorkspaceRejected: () => {
        dispatch(setWorkspaceRejected());
    },
    setPropertyInfo: (queryParameter, view, graphicId, authorities) => {
        dispatch(setPropertyInfo(queryParameter, view, graphicId, authorities));
    },
    setContractListInfo: (layerId, objectId) => {
        dispatch(setContractListInfo(layerId, objectId));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    setActiveFeatureMode: (activeFeatureMode: string) => {
        dispatch(setActiveFeatureMode(activeFeatureMode));
    },
    removeLoading: () => {
        dispatch(removeLoading());
    },
    activateLayers: (layers: Object[], workspace?: Object) => {
        dispatch(activateLayers(layers, workspace));
    },
    deactivateLayer: (layerId) => {
        dispatch(deactivateLayer(layerId));
    },
    setScale: (scale: number) => {
        dispatch(setScale(scale));
    },
    setActiveNav: (selectedNav) => {
        dispatch(setActiveNav(selectedNav));
    },
});

const InitMapContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(InitMap): any);

export default InitMapContainer;
