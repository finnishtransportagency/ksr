// @flow
import { connect } from 'react-redux';
import ReactTable from './ReactTable';

import { toggleSelection, toggleSelectAll, setEditedLayer } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const layer = state.table.features.activeTable && state.table.features.editedLayers.length
        ? state.table.features.editedLayers.find(l => l.id === state.table.features.activeTable)
        : null;

    const selectAll = layer && layer.data.length
        ? layer.data.find(d => !d._selected) === undefined
        : false;

    return {
        activeTable: state.table.features.activeTable,
        fetching: state.table.features.fetching,
        layer,
        selectAll,
        layerList: state.map.layerGroups.layerList,
        activeAdminTool: state.adminTool.active.layerId,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleSelection: (feature) => {
        dispatch(toggleSelection(feature));
    },
    toggleSelectAll: (layerId) => {
        dispatch(toggleSelectAll(layerId));
    },
    setEditedLayer: (data) => {
        dispatch(setEditedLayer(data));
    },
});

const ReactTableContainer = connect(mapStateToProps, mapDispatchToProps)(ReactTable);

export default ReactTableContainer;
