// @flow
import { connect } from 'react-redux';
import ModalSaveEditedData from './ModalSaveEditedData';

const mapStateToProps = state => ({
    originalLayers: state.table.features.layers,
    editedLayers: state.table.features.editedLayers,
});

const ModalSaveEditedDataContainer = connect(mapStateToProps)(ModalSaveEditedData);

export default ModalSaveEditedDataContainer;
