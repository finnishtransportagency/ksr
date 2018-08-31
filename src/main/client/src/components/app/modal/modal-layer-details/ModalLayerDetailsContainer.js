// @flow
import { connect } from 'react-redux';
import ModalLayerDetails from './ModalLayerDetails';
import { setTempGrapLayer } from '../../../../reducers/map/actions';

const mapStateToProps = (state) => {
    const activeLayer = (
        state.map.layerGroups.layerList && state.map.layerGroups.layerList.length ?
            state.map.layerGroups.layerList.find(l => l.id === state.adminTool.active.layerId) :
            null
    );

    return {
        fields: activeLayer ? activeLayer.fields.filter(f => f.type !== 'esriFieldTypeOID') : [],
        layer: state.map.mapView.graphicsLayer,
    };
};

const mapDispatchToProps = dispatch => ({
    setTempGrapLayer: (graphicsLayer) => {
        dispatch(setTempGrapLayer(graphicsLayer));
    },

});

const ModalLayerDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(ModalLayerDetails);

export default ModalLayerDetailsContainer;