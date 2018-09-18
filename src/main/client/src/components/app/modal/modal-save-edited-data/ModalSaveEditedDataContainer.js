// @flow
import { connect } from 'react-redux';
import ModalSaveEditedData from './ModalSaveEditedData';
import { saveEditedFeatures } from '../../../../reducers/table/actions';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    editedLayers: state.table.features.editedLayers,
});

const mapDispatchToProps = dispatch => ({
    saveEditedFeatures: (view, editedLayers) => {
        dispatch(saveEditedFeatures(view, editedLayers));
    },
});

const ModalSaveEditedDataContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalSaveEditedData);

export default ModalSaveEditedDataContainer;
