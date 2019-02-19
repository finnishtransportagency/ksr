// @flow
import { connect } from 'react-redux';
import ModalShapefile from './ModalShapefile';
import { setActiveModal, toggleDropzoneActive } from '../../../../reducers/modal/actions';
import { addShapefile } from '../../../../reducers/map/actions';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
    dropzone: state.modal.activeModal.dropzone,
});

const mapDispatchToProps = dispatch => ({
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    toggleDropzoneActive: () => {
        dispatch(toggleDropzoneActive());
    },
    addShapefile: (layer) => {
        dispatch(addShapefile(layer));
    },
});

const ModalShapefileContainer = connect(mapStateToProps, mapDispatchToProps)(ModalShapefile);

export default ModalShapefileContainer;
