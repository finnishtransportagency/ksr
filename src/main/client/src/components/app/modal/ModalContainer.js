// @flow
import { connect } from 'react-redux';
import ModalView from './ModalView';

const mapStateToProps = state => ({
    activeModal: state.modal.activeModal.activeModal,
    confirmModal: state.confirmModal.show,
    activePortal: state.portal.activePortal.activePortal,
});

const ModalContainer = (connect(mapStateToProps)(ModalView): any);

export default ModalContainer;
