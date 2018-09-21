// @flow
import { connect } from 'react-redux';
import { setEditMode, setMapView, setTempGraphicsLayer, setHasGraphics } from '../../../reducers/map/actions';
import { searchWorkspaceFeatures, selectFeatures, setSingleLayerGeometry } from './../../../reducers/table/actions';
import { setActiveModal } from '../../../reducers/modal/actions';
import { setWorkspace, setWorkspaceRejected } from '../../../reducers/workspace/actions';
import InitMap from './InitMap';

const mapStateToProps = (state) => {
    const selectedFeatures = state.table.features.layers
        .reduce((a, b) => a.concat(b.data.filter(d => d._selected)), []);

    return ({
        layerList: state.map.layerGroups.layerList,
        mapCenter: state.map.mapConfig.mapCenter,
        mapScale: state.map.mapConfig.mapScale,
        printServiceUrl: state.map.mapConfig.printServiceUrl,
        selectedFeatures,
        activeAdminTool: state.adminTool.active.layerId,
        sketchViewModel: state.map.mapTools.sketchViewModel,
        editMode: state.map.mapTools.editMode,
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
});

const InitMapContainer = connect(mapStateToProps, mapDispatchToProps)(InitMap);

export default InitMapContainer;