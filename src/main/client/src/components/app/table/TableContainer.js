// @flow
import { connect } from 'react-redux';
import { toggleFilter, toggleTable } from '../../../reducers/table/actions';
import TableView from './TableView';

const mapStateToProps = state => ({
    isOpen: state.table.toggleTable,
    isOpenFilter: state.table.toggleFilter,
    activeNav: state.navigation.activeNav,
});

const mapDispatchToProps = dispatch => ({
    toggleTable: () => {
        dispatch(toggleTable());
    },
    toggleFilter: () => {
        dispatch(toggleFilter());
    },
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(TableView);

export default TableContainer;
