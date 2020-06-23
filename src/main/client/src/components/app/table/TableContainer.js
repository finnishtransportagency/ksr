// @flow
import { connect } from 'react-redux';
import TableView from './TableView';

const mapStateToProps = state => ({
    isOpen: state.table.toggleTable,
    activeNav: state.navigation.activeNav,
    portalIsOpen: state.portal.togglePortal,
});

const TableContainer = (connect(mapStateToProps)(TableView): any);

export default TableContainer;
