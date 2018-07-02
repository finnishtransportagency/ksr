import { connect } from 'react-redux';
import Modal from './Modal';
import { setColumns } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const layer = (
        state.table.features.activeTable && state.table.features.layers.length ?
            state.table.features.layers.find(l => l.id === state.table.features.activeTable) : null
    );

    return {
        columns: layer ? layer.columns : [],
    };
};

const mapDispatchToProps = dispatch => ({
    handleModalSubmit: (data) => {
        dispatch(setColumns(data));
    },
});

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(Modal);

export default ModalContainer;
