// @flow
import { connect } from 'react-redux';
import { toggleFilter, toggleTable } from '../../../reducers/table/actions';
import { setActiveModal } from '../../../reducers/modal/actions';
import TableView from './TableView';

const mapStateToProps = state => ({
    isOpen: state.table.toggleTable,
    isOpenFilter: state.table.toggleFilter,
    activeNav: state.navigation.activeNav,
    activeModal: state.modal.activeModal,
    adminToolActive: state.adminTool.active,
});

const mapDispatchToProps = dispatch => ({
    toggleTable: () => {
        dispatch(toggleTable());
    },
    toggleFilter: () => {
        dispatch(toggleFilter());
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(TableView);

export default TableContainer;
