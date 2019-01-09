// @flow
import { connect } from 'react-redux';
import { setMapView, setTempGraphicsLayer, setHasGraphics, setLayerList } from '../../../reducers/map/actions';
import { setActiveModal } from '../../../reducers/modal/actions';
import { setPropertyInfo } from '../../../reducers/search/actions';
import {
    setSingleLayerGeometry,
    searchWorkspaceFeatures,
    selectFeatures,
    addNonSpatialContentToTable,
} from './../../../reducers/table/actions';
import { setWorkspace, setWorkspaceRejected } from '../../../reducers/workspace/actions';
import InitMap from './InitMap';
import { setContractListInfo } from '../../../reducers/contract/actions';
import { showConfirmModal } from '../../../reducers/confirmModal/actions';

const mapStateToProps = state => ({
    layerList: state.map.layerGroups.layerList,
    mapCenter: state.map.mapConfig.mapCenter,
    mapScale: state.map.mapConfig.mapScale,
    printServiceUrl: state.map.mapConfig.printServiceUrl,
    activeAdminTool: state.adminTool.active.layerId,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    geometryType: state.adminTool.active.geometryType,
    activeTool: state.map.mapTools.active,
    initialLoading: state.map.mapConfig.fetching || state.map.layerGroups.fetching,
    authorities: state.user.userInfo.authorities,
});

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
    searchWorkspaceFeatures: (queryMap, layerList) => {
        dispatch(searchWorkspaceFeatures(queryMap, layerList));
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
    addNonSpatialContentToTable: (layer, workspaceFeatures) => {
        dispatch(addNonSpatialContentToTable(layer, workspaceFeatures));
    },
    setContractListInfo: (layerId, objectId) => {
        dispatch(setContractListInfo(layerId, objectId));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    setLayerList: (layerList: Object[]) => {
        dispatch(setLayerList(layerList));
    },
});

const InitMapContainer = connect(mapStateToProps, mapDispatchToProps)(InitMap);

export default InitMapContainer;
