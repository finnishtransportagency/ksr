import { connect } from 'react-redux';
import Modal from './Modal';
import { setFeatureData } from '../../../../reducers/table/actions';

const mapStateToProps = state => ({
    columns: Array.from(state.table.features.columns.values()),
});

const mapDispatchToProps = dispatch => ({
    handleModalSubmit: (data) => {
        dispatch(setFeatureData(data));
    },
});

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(Modal);

export default ModalContainer;
