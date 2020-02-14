// @flow
import { connect } from 'react-redux';
import {
    setActiveTool,
    setTempGraphicsLayer,
    setActiveToolMenu,
    setActiveFeatureMode,
} from '../../../../../reducers/map/actions';
import { setPropertyInfo } from '../../../../../reducers/search/actions';
import { closeTableTab, selectFeatures } from '../../../../../reducers/table/actions';
import SketchTool from './SketchTool';
import { setActiveModal } from '../../../../../reducers/modal/actions';
import { showConfirmModal } from '../../../../../reducers/confirmModal/actions';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    tempGraphicsLayer: state.map.mapView.graphicsLayer,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    data: state.table.features.layers
        .reduce((a, b) => (b.type !== 'agfl' ? a.concat(b.data.filter(d => d._selected)) : a), []),
    activeAdminTool: state.adminTool.active.layerId,
    editModeActive: state.map.mapTools.activeFeatureMode === 'edit',
    geometryType: state.adminTool.active.geometryType,
    activeModal: state.modal.activeModal,
    isOpen: state.map.mapTools.activeToolMenu === 'sketchTools',
    layerList: state.map.layerGroups.layerList,
    propertyAreaSearch: state.search.propertyInfo.propertyAreaSearch,
    authorities: state.user.userInfo.authorities,
    hasTableEdited: state.table.features.hasTableEdited,
    editedLayers: state.table.features.editedLayers,
    featureType: state.map.layerGroups.layerList,
    addressField: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    setActiveTool: (active) => {
        dispatch(setActiveTool(active));
    },
    setTempGraphicsLayer: (graphicsLayer) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveModal: (editModeActive: boolean) => {
        dispatch(setActiveModal('editLayerDetails', editModeActive));
    },
    setActiveToolMenu: (activeMenu) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
    setPropertyInfo: (queryParameter, view, graphicId, authorities) => {
        dispatch(setPropertyInfo(queryParameter, view, graphicId, authorities));
    },
    setActiveFeatureMode: (activeFeatureMode: string) => {
        dispatch(setActiveFeatureMode(activeFeatureMode));
    },
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function,
        cancel: Function,
    ) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept, cancel));
    },
    closeTableTab: (layerId) => {
        dispatch(closeTableTab(layerId));
    },
});

const SketchToolContainer = (connect(mapStateToProps, mapDispatchToProps)(SketchTool): any);

export default SketchToolContainer;
