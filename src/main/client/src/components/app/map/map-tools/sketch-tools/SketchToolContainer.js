// @flow
import { connect } from 'react-redux';
import {
    setActiveTool,
    setTempGraphicsLayer,
    setActiveToolMenu,
} from '../../../../../reducers/map/actions';
import { setPropertyInfo } from '../../../../../reducers/search/actions';
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
        .reduce((a, b) => (b.type !== 'agfl' ? a.concat(b.data.filter(d => d._selected)) : a), []),
    activeAdminTool: state.adminTool.active.layerId,
    geometryType: state.adminTool.active.geometryType,
    activeModal: state.modal.activeModal,
    isOpen: state.map.mapTools.activeToolMenu === 'sketchTools',
    layerList: state.map.layerGroups.layerList,
    propertyAreaSearch: state.search.propertyInfo.propertyAreaSearch,
    authorities: state.user.userInfo.authorities,
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
    setTempGraphicsLayer: (graphicsLayer) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    setActiveToolMenu: (activeMenu) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
    setPropertyInfo: (queryParameter, view, graphicId, authorities) => {
        dispatch(setPropertyInfo(queryParameter, view, graphicId, authorities));
    },
});

const SketchToolContainer = connect(mapStateToProps, mapDispatchToProps)(SketchTool);

export default SketchToolContainer;
