// @flow
import { connect } from 'react-redux';
import { toggleTable } from '../../../reducers/table/actions';
import TableView from './TableView';

const mapStateToProps = state => ({
    isOpen: state.table.toggleTable,
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = dispatch => ({
    toggleTable: () => {
        dispatch(toggleTable());
    },
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(TableView);

export default TableContainer;
