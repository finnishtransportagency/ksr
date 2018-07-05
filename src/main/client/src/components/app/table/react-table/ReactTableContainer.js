// @flow
import { connect } from 'react-redux';
import ReactTable from './ReactTable';

import { toggleSelection, toggleSelectAll } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const layer = state.table.features.activeTable && state.table.features.layers.length ?
        state.table.features.layers.find(l => l.id === state.table.features.activeTable) : null;

    const selectAll = layer && layer.data.length
        ? layer.data.find(d => !d._selected) === undefined : false;

    return {
        activeTable: state.table.features.activeTable,
        fetching: state.table.features.fetching,
        layer,
        selectAll,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleSelection: (feature) => {
        dispatch(toggleSelection(feature));
    },
    toggleSelectAll: (layerId) => {
        dispatch(toggleSelectAll(layerId));
    },
});

const ReactTableContainer = connect(mapStateToProps, mapDispatchToProps)(ReactTable);

export default ReactTableContainer;
