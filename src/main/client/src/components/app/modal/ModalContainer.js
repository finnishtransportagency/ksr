// @flow
import { connect } from 'react-redux';
import ModalView from './ModalView';

const mapStateToProps = state => ({
    activeModal: state.modal.activeModal,
});

const ModalContainer = connect(mapStateToProps)(ModalView);

export default ModalContainer;
