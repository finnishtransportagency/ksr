import { connect } from 'react-redux';
import { hideConfirmModal } from '../../../../reducers/confirmModal/actions';
import ConfirmModal from './ConfirmModal';

const mapStateToProps = state => ({
    show: state.confirmModal.show,
    body: state.confirmModal.body,
    acceptText: state.confirmModal.acceptText,
    cancelText: state.confirmModal.cancelText,
    accept: state.confirmModal.accept,
});

const mapDispatchToProps = dispatch => ({
    hideConfirmModal: () => {
        dispatch(hideConfirmModal());
    },
});

const ConfirmModalContainer = connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);

export default ConfirmModalContainer;
