import { connect } from 'react-redux';
import ModalFilter from './ModalFilter';
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
    setColumns: (data) => {
        dispatch(setColumns(data));
    },
});

const ModalFilterContainer = connect(mapStateToProps, mapDispatchToProps)(ModalFilter);

export default ModalFilterContainer;
