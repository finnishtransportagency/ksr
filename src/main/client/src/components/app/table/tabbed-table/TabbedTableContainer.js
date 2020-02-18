// @flow
import { connect } from 'react-redux';
import TabbedTableView from './TabbedTableView';

import { closeTableTab, setActiveTable } from '../../../../reducers/table/actions';

const mapStateToProps = state => ({
    layers: state.table.features.layers.map(l => ({
        id: l.id,
        title: l.title,
        _source: l._source,
        type: l.type,
    })),
    activeTable: state.table.features.activeTable,
    activeAdmin: state.adminTool.active.layerId,
    view: state.map.mapView.view,
    hasTableEdited: state.table.features.hasTableEdited,
    editedLayers: state.table.features.editedLayers,
    featureType: state.map.layerGroups.layerList,
    addressField: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    setActiveTable: (activeTable) => {
        dispatch(setActiveTable(activeTable));
    },
    closeTableTab: (layerId, view, editedLayers, featureType, addressField) => {
        dispatch(closeTableTab(layerId, view, editedLayers, featureType, addressField));
    },
});

export default (connect(mapStateToProps, mapDispatchToProps)(TabbedTableView): any);
