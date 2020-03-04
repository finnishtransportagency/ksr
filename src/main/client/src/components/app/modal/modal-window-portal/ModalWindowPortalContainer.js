// @flow
import { connect } from 'react-redux';
import ModalWindowPortal from './ModalWindowPortal';
import { setActivePortal } from '../../../../reducers/portal/actions';

const mapDispatchToProps = dispatch => ({
    setActivePortal: (activePortal) => {
        dispatch(setActivePortal(activePortal));
    },
});

const ModalWindowPortalContainer = (connect(null, mapDispatchToProps)(ModalWindowPortal): any);

export default ModalWindowPortalContainer;
