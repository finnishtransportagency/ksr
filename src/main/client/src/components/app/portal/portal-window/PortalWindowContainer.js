// @flow
import { connect } from 'react-redux';
import PortalWindow from './PortalWindow';
import { togglePortal } from '../../../../reducers/portal/actions';

const mapStateToProps = (state: Object) => ({
    portalIsOpen: state.portal.togglePortal,
    activeTable: state.table.features.activeTable,
});

const mapDispatchToProps = (dispatch: Function) => ({
    togglePortal: () => {
        dispatch(togglePortal());
    },
});

const PortalWindowContainer = (connect(mapStateToProps, mapDispatchToProps)(PortalWindow): any);

export default PortalWindowContainer;
