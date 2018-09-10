// @flow
import { connect } from 'react-redux';
import {
    setActiveTool,
    setEditMode,
    setTempGraphicsLayer,
    setActiveToolMenu,
} from '../../../../../reducers/map/actions';
import { selectFeatures, deSelectSelected } from '../../../../../reducers/table/actions';
import SketchTool from './SketchTool';
import { setActiveModal } from '../../../../../reducers/modal/actions';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    tempGraphicsLayer: state.map.mapView.graphicsLayer,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    data: state.table.features.layers
        .reduce((a, b) => a.concat(b.data.filter(d => d._selected)), []),
    adminToolActive: state.adminTool.active.layerId,
    geometryType: state.adminTool.active.geometryType,
    activeModal: state.modal.activeModal,
    isOpen: state.map.mapTools.activeToolMenu === 'sketchTools',
});

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    deSelectSelected: () => {
        dispatch(deSelectSelected());
    },
    setActiveTool: (active) => {
        dispatch(setActiveTool(active));
    },
    setEditMode: (editMode) => {
        dispatch(setEditMode(editMode));
    },
    setTempGraphicsLayer: (graphicsLayer) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    setActiveToolMenu: (activeMenu) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
});

const SketchToolContainer = connect(mapStateToProps, mapDispatchToProps)(SketchTool);

export default SketchToolContainer;
