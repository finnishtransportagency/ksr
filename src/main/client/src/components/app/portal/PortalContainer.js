// @flow
import { connect } from 'react-redux';
import PortalView from './PortalView';

const mapStateToProps = (state: Object) => ({
    portalIsOpen: state.portal.togglePortal,
});

const PortalContainer = (connect(mapStateToProps)(PortalView): any);

export default PortalContainer;
