import { connect } from 'react-redux';
import { setActiveModal } from '../../../../reducers/modal/actions';
import Modal from './Modal';

const mapStateToProps = (state: Object) => ({
    activeModal: state.modal.activeModal.activeModal,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
});

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(Modal);

export default ModalContainer;
