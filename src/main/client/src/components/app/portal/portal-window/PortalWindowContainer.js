// @flow
import { connect } from 'react-redux';
import PortalWindow from './PortalWindow';
import { togglePortal } from '../../../../reducers/portal/actions';

const mapStateToProps = state => ({
    portalIsOpen: state.portal.togglePortal,
    activeTable: state.table.features.activeTable,
});

const mapDispatchToProps = dispatch => ({
    togglePortal: () => {
        dispatch(togglePortal());
    },
});

const PortalWindowContainer = (connect(mapStateToProps, mapDispatchToProps)(PortalWindow): any);

export default PortalWindowContainer;
