// @flow
import { connect } from 'react-redux';
import { setContractListInfo } from '../../../../reducers/contract/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import ReactTable from './ReactTable';

import {
    toggleSelection,
    toggleSelectAll,
    setEditedLayer,
    setRowFilter,
    setTableEdited,
    addFiltered,
    setActivePage,
} from '../../../../reducers/table/actions';
import { updatePortal } from '../../../../reducers/portal/actions';

const mapStateToProps = (state) => {
    const { activeTable, editedLayers } = state.table.features;
    const { activePage } = state.table;

    const layerFeatures = activeTable && editedLayers.length
        ? editedLayers.find(l => l.id === activeTable)
        : null;

    const selectAll = layerFeatures && layerFeatures.data.length
        ? layerFeatures.data.find(d => !d._selected) === undefined
        : false;

    return {
        activeTable,
        fetching: state.table.features.fetching,
        layerFeatures,
        selectAll,
        layerList: state.map.layerGroups.layerList,
        activeAdminTool: state.adminTool.active.layerId,
        portalIsOpen: state.portal.togglePortal,
        activePage,
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
    setActivePage: (page) => {
        dispatch(setActivePage(page));
    },
    updatePortal: () => {
        dispatch(updatePortal());
    },
});

const ReactTableContainer = (connect(mapStateToProps, mapDispatchToProps)(ReactTable): any);

export default ReactTableContainer;
