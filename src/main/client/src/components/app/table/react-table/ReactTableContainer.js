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
    addFeatureNoGeometry,
} from '../../../../reducers/table/actions';
import { updatePortal } from '../../../../reducers/portal/actions';
import { setActiveTool, setActiveToolMenu } from '../../../../reducers/map/actions';
import { resetMapTools } from '../../../../utils/mapTools';
import { convertEsriGeometryType } from '../../../../utils/type';

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
        sketchActive: state.map.mapTools.active,
        draw: state.map.mapTools.draw,
        sketchViewModel: state.map.mapTools.sketchViewModel,
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
    addNewGeometryToFeature2: (draw, sketchViewModel, feature) => {
        dispatch(addFeatureNoGeometry(feature));
        dispatch(setActiveToolMenu('sketchActiveAdmin'));
        resetMapTools(draw, sketchViewModel, input => dispatch(setActiveTool(input)));
        dispatch(setActiveTool('sketchActiveAdmin'));
    },
});

const mergeProps = (stateToProps, dispatchToProps) => ({
    ...stateToProps,
    ...dispatchToProps,
    addNewGeometryToFeature: (feature: Object) => {
        const { geometryType } = stateToProps.layerList.find(l => l.id === feature._layerId);
        const mappedFeature = {};
        Object.keys(feature).forEach((attribute) => {
            if (attribute.startsWith(feature._layerId)) {
                mappedFeature[attribute.replace(`${feature._layerId}/`, '')] = feature[attribute];
            } else if (!attribute.startsWith('_')) {
                mappedFeature[attribute] = feature[attribute];
            }
        });
        dispatchToProps.addNewGeometryToFeature2(
            stateToProps.draw,
            stateToProps.sketchViewModel,
            mappedFeature,
        );
        const convertedGeometryType = convertEsriGeometryType(geometryType);
        stateToProps.sketchViewModel.create(convertedGeometryType);
    },
});

const ReactTableContainer = (connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReactTable): any);

export default ReactTableContainer;
