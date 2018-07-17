// @flow
import { connect } from 'react-redux';
import ModalClearTable from './ModalClearTable';
import { clearTableData } from '../../../../reducers/table/actions';

const mapDispatchToProps = dispatch => ({
    clearTableData: () => {
        dispatch(clearTableData());
    },
});

const ModalClearTableContainer = connect(null, mapDispatchToProps)(ModalClearTable);

export default ModalClearTableContainer;
