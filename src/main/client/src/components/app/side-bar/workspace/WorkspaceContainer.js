// @flow
import { connect } from 'react-redux';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';
import { searchWorkspaceFeatures, selectFeatures } from '../../../../reducers/table/actions';
import { setWorkspace, setWorkspaceRejected, updateWorkspaces } from '../../../../reducers/workspace/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import Workspace from './Workspace';
import {
    setLayerList, toggleLayerLegend, activateLayers, deactivateLayer,
} from '../../../../reducers/map/actions';

const mapStateToProps = state => ({
    workspaceList: state.workspace.workspace.workspaceList,
    selectedFeatures: state.table.features.layers,
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
    layerLegendActive: state.map.layerLegend.layerLegendActive,
    loadingLayers: state.loading.loadingLayers.length,
});

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    setActiveModal: (activeModal: string) => {
        dispatch(setActiveModal(activeModal));
    },
    updateWorkspaces: (workspaceFetch: Function, fetchParam: Object | string, type: string) => {
        dispatch(updateWorkspaces(workspaceFetch, fetchParam, type));
    },
    setWorkspace: () => {
        dispatch(setWorkspace());
    },
    setWorkspaceRejected: () => {
        dispatch(setWorkspaceRejected());
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    searchWorkspaceFeatures: (workspace, layerList) => {
        dispatch(searchWorkspaceFeatures(workspace, layerList));
    },
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
    toggleLayerLegend: () => {
        dispatch(toggleLayerLegend());
    },
    activateLayers: (layers: Object[], workspace: Object) => {
        dispatch(activateLayers(layers, workspace));
    },
    deactivateLayer: (layerId: string) => {
        dispatch(deactivateLayer(layerId));
    },
});

const WorkspaceContainer = (connect(mapStateToProps, mapDispatchToProps)(Workspace): any);

export default WorkspaceContainer;
