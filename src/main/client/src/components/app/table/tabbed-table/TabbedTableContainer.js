// @flow
import { connect } from 'react-redux';
import TabbedTable from './TabbedTable';

import { closeTableTab, setActiveTable, saveEditedFeatures } from '../../../../reducers/table/actions';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';

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
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function,
        cancel: Function,
    ) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept, cancel));
    },
    saveEditedFeatures: (view, editedLayers, featureType, addressField) => {
        dispatch(saveEditedFeatures(view, editedLayers, featureType, addressField));
    },
    closeTableTab: (layerId) => {
        dispatch(closeTableTab(layerId));
    },
});

export default (connect(mapStateToProps, mapDispatchToProps)(TabbedTable): any);
