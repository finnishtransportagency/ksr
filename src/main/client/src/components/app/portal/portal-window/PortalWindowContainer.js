// @flow
import { connect } from 'react-redux';
import PortalWindow from './PortalWindow';
import { togglePortal } from '../../../../reducers/portal/actions';
import store from '../../../../store';

const mapStateToProps = (state) => {
    const storeActiveTable = store.getState().table.features.activeTable;

    return {
        portalIsOpen: state.portal.togglePortal,
        activeTable: storeActiveTable,
    };
};

const mapDispatchToProps = dispatch => ({
    togglePortal: () => {
        dispatch(togglePortal());
    },
});

const PortalWindowContainer = (connect(mapStateToProps, mapDispatchToProps)(PortalWindow): any);

export default PortalWindowContainer;
