// @flow
import { connect } from 'react-redux';
import ModalView from './ModalView';

const mapStateToProps = (state: Object) => ({
    activeModal: state.modal.activeModal.activeModal,
    confirmModal: state.confirmModal.show,
});

const ModalContainer = (connect(mapStateToProps)(ModalView): any);

export default ModalContainer;
