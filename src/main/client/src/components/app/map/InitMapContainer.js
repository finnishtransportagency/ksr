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
    setActiveTool,
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

const mapStateToProps = (state: Object) => {
    const { layers } = state.table.features;
    const { layerList } = state.map.layerGroups;
    const geometryDataSelected = layers
        .flatMap(f => f.data.filter(d => d._selected && d.geometry));

    let selectedLayerIds = geometryDataSelected.map(layer => layer._layerId);
    selectedLayerIds = [...new Set(selectedLayerIds)];

    const activeLayers = layerList.filter(l => l.active);
    let attributions = activeLayers.map(al => al.attribution);
    attributions = [...new Set(attributions)].toString();

    const customPrintParameters = {
        layers: selectedLayerIds.map(layerId => ({
            layerId,
            objectIds: geometryDataSelected
                .filter(layer => layer._layerId === layerId)
                .map(feature => feature._id),
        })),
        attributions,
    };

    const printServiceUrl = `${state.map.mapConfig.printServiceUrl}?customPrintParameters=${JSON.stringify(customPrintParameters)}`;

    return {
        layerList,
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

const mapDispatchToProps = (dispatch: Function) => ({
    selectFeatures: (features: any) => {
        dispatch(selectFeatures(features));
    },
    setMapView: (view: any) => {
        dispatch(setMapView(view));
    },
    setTempGraphicsLayer: (graphicsLayer: any) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveModal: (activeModal: any, data?: any) => {
        dispatch(setActiveModal(activeModal, data));
    },
    setSingleLayerGeometry: (geometry: any) => {
        dispatch(setSingleLayerGeometry(geometry));
    },
    setHasGraphics: (hasGraphics: any) => {
        dispatch(setHasGraphics(hasGraphics));
    },
    setWorkspace: () => {
        dispatch(setWorkspace());
    },
    setWorkspaceRejected: () => {
        dispatch(setWorkspaceRejected());
    },
    setPropertyInfo: (queryParameter: any, view: any, graphicId: any, authorities: any) => {
        dispatch(setPropertyInfo(queryParameter, view, graphicId, authorities));
    },
    setContractListInfo: (layerId: any, objectId: any) => {
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
    deactivateLayer: (layerId: any) => {
        dispatch(deactivateLayer(layerId));
    },
    setScale: (scale: number) => {
        dispatch(setScale(scale));
    },
    setActiveNav: (selectedNav: any) => {
        dispatch(setActiveNav(selectedNav));
    },
    setActiveTool: (active: any) => {
        dispatch(setActiveTool(active));
    },
});

const InitMapContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(InitMap): any);

export default InitMapContainer;
