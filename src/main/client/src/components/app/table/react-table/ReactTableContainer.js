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

const mapStateToProps = (state: Object) => {
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

const mapDispatchToProps = (dispatch: Function) => ({
    toggleSelection: (feature: any) => {
        dispatch(toggleSelection(feature));
    },
    toggleSelectAll: (layerId: any) => {
        dispatch(toggleSelectAll(layerId));
    },
    setEditedLayer: (data: any) => {
        dispatch(setEditedLayer(data));
    },
    setActiveModal: (activeModal: any, modalData: any) => {
        dispatch(setActiveModal(activeModal, modalData));
    },
    setContractListInfo: (layerId: any, objectId: any) => {
        dispatch(setContractListInfo(layerId, objectId));
    },
    setRowFilter: (activeTable: any) => {
        dispatch(setRowFilter(activeTable));
    },
    setTableEdited: (hasEdited: any) => {
        dispatch(setTableEdited(hasEdited));
    },
    addFiltered: (filtered: any) => {
        dispatch(addFiltered(filtered));
    },
    setActivePage: (page: any) => {
        dispatch(setActivePage(page));
    },
    updatePortal: () => {
        dispatch(updatePortal());
    },
    addNewGeometryToFeature2: (draw: any, sketchViewModel: any, feature: any) => {
        dispatch(addFeatureNoGeometry(feature));
        dispatch(setActiveToolMenu('sketchActiveAdmin'));
        resetMapTools(draw, sketchViewModel, input => dispatch(setActiveTool(input)));
        dispatch(setActiveTool('sketchActiveAdmin'));
    },
});

const mergeProps = (stateToProps: any, dispatchToProps: any) => ({
    ...stateToProps,
    ...dispatchToProps,
    addNewGeometryToFeature: (feature: Object) => {
        const { geometryType } = stateToProps.layerList.find(l => l.id === feature._layerId);
        const mappedFeature: any = {};
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
