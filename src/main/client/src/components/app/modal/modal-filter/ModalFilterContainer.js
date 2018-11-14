import { connect } from 'react-redux';
import ModalFilter from './ModalFilter';
import { setColumns } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const layer = (
        state.table.features.activeTable && state.table.features.layers.length ?
            state.table.features.layers.find(l => l.id === state.table.features.activeTable) : null
    );
    let filteredColumns = [];

    if (layer && layer.columns) {
        filteredColumns = layer.columns.filter(key => key.Header.toLowerCase() !== 'objectid' &&
            key.Header.toLowerCase() !== 'objectid_1' &&
            key.Header.toLowerCase() !== 'symbolidentifier' &&
            key.Header.toLowerCase() !== 'geom');
    }

    return {
        columns: filteredColumns,
    };
};

const mapDispatchToProps = dispatch => ({
    setColumns: (data) => {
        dispatch(setColumns(data));
    },
});

const ModalFilterContainer = connect(mapStateToProps, mapDispatchToProps)(ModalFilter);

export default ModalFilterContainer;
