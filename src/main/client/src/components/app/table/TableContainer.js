// @flow
import { connect } from 'react-redux';
import TableView from './TableView';

const mapStateToProps = state => ({
    isOpen: state.table.toggleTable,
    activeNav: state.navigation.activeNav,
});

const TableContainer = connect(mapStateToProps)(TableView);

export default TableContainer;
