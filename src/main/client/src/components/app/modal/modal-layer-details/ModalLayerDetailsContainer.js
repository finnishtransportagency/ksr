// @flow
import { connect } from 'react-redux';
import ModalLayerDetails from './ModalLayerDetails';
import { setActiveFeatureMode, setTempGraphicsLayer } from '../../../../reducers/map/actions';

const mapStateToProps = (state) => {
    const activeLayer = (
        state.map.layerGroups.layerList && state.map.layerGroups.layerList.length ?
            state.map.layerGroups.layerList.find(l => l.id === state.adminTool.active.layerId) :
            null
    );
    const { addressField, featureType } = state.map.layerGroups.layerList
        .find(l => l.id === state.adminTool.active.layerId);

    const fields = activeLayer ? activeLayer.fields.filter(f =>
        f.type !== 'esriFieldTypeOID' && f.name !== addressField && f.editable) : [];

    const objectId = activeLayer && activeLayer.fields.find(f => f.type === 'esriFieldTypeOID');

    return {
        objectId,
        fields,
        activeLayer,
        layer: state.map.mapView.graphicsLayer,
        originalLayerId: state.adminTool.active.layerId,
        addressField,
        featureType,
        view: state.map.mapView.view,
        sketchViewModel: state.map.mapTools.sketchViewModel,
        editModeActive: state.modal.activeModal.data,
    };
};

const mapDispatchToProps = dispatch => ({
    setTempGraphicsLayer: (graphicsLayer) => {
        dispatch(setTempGraphicsLayer(graphicsLayer));
    },
    setActiveFeatureMode: (activeFeatureMode: string) => {
        dispatch(setActiveFeatureMode(activeFeatureMode));
    },
});

const ModalLayerDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(ModalLayerDetails);

export default ModalLayerDetailsContainer;
