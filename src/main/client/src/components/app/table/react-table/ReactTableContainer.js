// @flow
import { connect } from 'react-redux';
import { setContractListInfo } from '../../../../reducers/contract/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';
import ReactTable from './ReactTable';

import {
    toggleSelection,
    toggleSelectAll,
    setEditedLayer,
    setRowFilter,
    setTableEdited,
    addFiltered,
    saveEditedFeatures,
} from '../../../../reducers/table/actions';
import { updatePortal } from '../../../../reducers/portal/actions';

const mapStateToProps = (state) => {
    const { activeTable, editedLayers } = state.table.features;

    const layerFeatures = activeTable && editedLayers.length
        ? editedLayers.find(l => l.id === activeTable)
        : null;

    const selectAll = layerFeatures && layerFeatures.data.length
        ? layerFeatures.data.find(d => !d._selected) === undefined
        : false;

    const { addressField, featureType } = state.adminTool.active.layerId
        && state.map.layerGroups.layerList.find(l => l.id === state.adminTool.active.layerId);

    return {
        activeTable,
        editedLayers,
        fetching: state.table.features.fetching,
        layerFeatures,
        selectAll,
        layerList: state.map.layerGroups.layerList,
        activeAdminTool: state.adminTool.active.layerId,
        portalIsOpen: state.portal.togglePortal,
        featureType,
        addressField,
        view: state.map.mapView.view,
        hasTableEdited: state.table.features.hasTableEdited,
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
    setActiveModal: (activeModal, modalData) => {
        dispatch(setActiveModal(activeModal, modalData));
    },
    setContractListInfo: (layerId, objectId) => {
        dispatch(setContractListInfo(layerId, objectId));
    },
    setRowFilter: (activeTable) => {
        dispatch(setRowFilter(activeTable));
    },
    setTableEdited: (hasEdited) => {
        dispatch(setTableEdited(hasEdited));
    },
    addFiltered: (filtered) => {
        dispatch(addFiltered(filtered));
    },
    updatePortal: () => {
        dispatch(updatePortal());
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
});

const ReactTableContainer = (connect(mapStateToProps, mapDispatchToProps)(ReactTable): any);

export default ReactTableContainer;
