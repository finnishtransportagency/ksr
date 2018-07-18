import { connect } from 'react-redux';
import { setActiveModal } from '../../../../reducers/modal/actions';
import Modal from './Modal';

const mapStateToProps = state => ({
    activeModal: state.modal.activeModal,
});

const mapDispatchToProps = dispatch => ({
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
});

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(Modal);

export default ModalContainer;
