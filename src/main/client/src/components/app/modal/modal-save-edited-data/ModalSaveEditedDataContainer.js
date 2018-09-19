// @flow
import { connect } from 'react-redux';
import ModalSaveEditedData from './ModalSaveEditedData';
import { saveEditedFeatures } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const { addressField, featureType } = state.adminTool.active.layerId
        && state.map.layerGroups.layerList.find(l => l.id === state.adminTool.active.layerId);

    return {
        view: state.map.mapView.view,
        editedLayers: state.table.features.editedLayers,
        addressField,
        featureType,
    };
};

const mapDispatchToProps = dispatch => ({
    saveEditedFeatures: (view, editedLayers, featureType, addressField) => {
        dispatch(saveEditedFeatures(view, editedLayers, featureType, addressField));
    },
});

const ModalSaveEditedDataContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalSaveEditedData);

export default ModalSaveEditedDataContainer;
