// @flow
import { connect } from 'react-redux';
import TabbedTableView from './TabbedTableView';

import { closeTableTab, setActiveTable } from '../../../../reducers/table/actions';
import { nestedVal } from '../../../../utils/nestedValue';

const mapStateToProps = (state) => {
    const { layerList } = state.map.layerGroups;

    return {
        layers: state.table.features.layers.map(l => ({
            id: l.id,
            title: l.title,
            _source: l._source,
            type: l.type,
            parentLayer: nestedVal(layerList.find(layer => layer.id === l.id.replace('_s', '')), ['parentLayer']),
        })),
        activeTable: state.table.features.activeTable,
        activeAdmin: state.adminTool.active.layerId,
        view: state.map.mapView.view,
        hasTableEdited: state.table.features.hasTableEdited,
        editedLayers: state.table.features.editedLayers,
        featureType: state.map.layerGroups.layerList,
        addressField: state.map.layerGroups.layerList,
    };
};

const mapDispatchToProps = dispatch => ({
    setActiveTable: (activeTable) => {
        dispatch(setActiveTable(activeTable));
    },
    closeTableTab: (layerId, view, editedLayers, featureType, addressField) => {
        dispatch(closeTableTab(layerId, view, editedLayers, featureType, addressField));
    },
});

export default (connect(mapStateToProps, mapDispatchToProps)(TabbedTableView): any);
