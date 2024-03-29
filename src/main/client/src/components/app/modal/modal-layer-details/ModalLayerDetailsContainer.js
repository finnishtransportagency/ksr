// @flow
import { connect } from 'react-redux';
import ModalLayerDetails from './ModalLayerDetails';
import { setActiveFeatureMode, setTempGraphicsLayer } from '../../../../reducers/map/actions';

const mapStateToProps = (state: Object) => {
    const activeLayer = (
        state.map.layerGroups.layerList && state.map.layerGroups.layerList.length
            ? state.map.layerGroups.layerList.find(l => l.id === state.adminTool.active.layerId)
            : null
    );
    const { addressField, featureType } = state.map.layerGroups.layerList
        .find(l => l.id === state.adminTool.active.layerId);

    const objectId = activeLayer && activeLayer.fields.find(f => f.type === 'esriFieldTypeOID');

    return {
        objectId,
        activeLayer,
        layer: state.map.mapView.graphicsLayer,
        originalLayerId: state.adminTool.active.layerId,
        addressField,
        featureType,
        view: state.map.mapView.view,
        sketchViewModel: state.map.mapTools.sketchViewModel,
        editModeActive: state.modal.activeModal.data,
        featureNoGeometry: state.map.mapTools.featureNoGeometry,
    };
};

const mapDispatchToProps = (dispatch: Function) => ({
    setTempGraphicsLayer: (graphicsLayer: any) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveFeatureMode: (activeFeatureMode: string) => {
        dispatch(setActiveFeatureMode(activeFeatureMode));
    },
});

const ModalLayerDetailsContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalLayerDetails): any);

export default ModalLayerDetailsContainer;
