// @flow
import { connect } from 'react-redux';
import {
    setActiveTool,
    setTempGraphicsLayer,
    setActiveToolMenu,
    setActiveFeatureMode,
} from '../../../../../reducers/map/actions';
import { setPropertyInfo } from '../../../../../reducers/search/actions';
import { addFeatureNoGeometry, selectFeatures, sketchSaveData } from '../../../../../reducers/table/actions';
// import SketchTool from './SketchTool';
import SketchTool2 from './SketchTool2';
import { setActiveModal } from '../../../../../reducers/modal/actions';

const mapStateToProps = (state: Object) => ({
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

const mapDispatchToProps = (dispatch: Function) => ({
    selectFeatures: (features: any) => {
        dispatch(selectFeatures(features));
    },
    setActiveTool: (active: any) => {
        dispatch(setActiveTool(active));
    },
    setTempGraphicsLayer: (graphicsLayer: any) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveModal: (editModeActive: boolean) => {
        dispatch(setActiveModal('editLayerDetails', editModeActive));
    },
    setActiveToolMenu: (activeMenu: any) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
    setPropertyInfo: (queryParameter: any, view: any, graphicId: any, authorities: any) => {
        dispatch(setPropertyInfo(queryParameter, view, graphicId, authorities));
    },
    setActiveFeatureMode: (activeFeatureMode: string) => {
        dispatch(setActiveFeatureMode(activeFeatureMode));
    },
    sketchSaveData: (view: any, editedLayers: any, featureType: any, addressField: any, hasTableEdited: any) => {
        dispatch(sketchSaveData(view, editedLayers, featureType, addressField, hasTableEdited));
    },
    resetFeatureNoGeometry: () => {
        dispatch(addFeatureNoGeometry());
    },
});

const SketchToolContainer = (connect(mapStateToProps, mapDispatchToProps)(SketchTool2): any);

export default SketchToolContainer;
