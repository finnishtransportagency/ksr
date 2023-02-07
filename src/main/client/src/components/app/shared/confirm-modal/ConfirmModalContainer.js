// @flow
import { connect } from 'react-redux';
import { hideConfirmModal } from '../../../../reducers/confirmModal/actions';
import ConfirmModal from './ConfirmModal';

const mapStateToProps = (state: Object) => ({
    show: state.confirmModal.show,
    body: state.confirmModal.body,
    acceptText: state.confirmModal.acceptText,
    cancelText: state.confirmModal.cancelText,
    accept: state.confirmModal.accept,
    cancel: state.confirmModal.cancel,
});

const mapDispatchToProps = (dispatch: Function) => ({
    hideConfirmModal: () => {
        dispatch(hideConfirmModal());
    },
});

const ConfirmModalContainer = (connect(mapStateToProps, mapDispatchToProps)(ConfirmModal): any);

export default ConfirmModalContainer;
