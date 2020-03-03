// @flow
import { connect } from 'react-redux';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';
import {
    toggleFilter, toggleTable, clearTableData, saveEditedFeatures, setButtonAmount,
} from '../../../../reducers/table/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import TableButtons from './TableButtons';
import { togglePortal, updatePortal } from '../../../../reducers/portal/actions';
import { nestedVal } from '../../../../utils/nestedValue';

const mapStateToProps = (state) => {
    const removeUnderscore = (layer) => {
        const filteredData = [];
        layer.data.map((d) => {
            const filtered = Object.keys(d)
                .filter(key => key.substring(0, 1) !== '_')
                .reduce((obj, key) => {
                    obj[key] = d[key];
                    return obj;
                }, {});

            return filteredData.push(filtered);
        });

        return {
            ...layer,
            data: filteredData,
        };
    };

    const tableFeaturesLayers = state.table.features.layers;
    const { layerList } = state.map.layerGroups;
    const { activeTable } = state.table.features;
    const { layerId } = state.adminTool.active;

    const originalLayers = tableFeaturesLayers.map(l => removeUnderscore(l));
    const geometryDataSelected = tableFeaturesLayers
        .flatMap(f => f.data.filter(d => d._selected && d.geometry));
    const activeTableFeatureLayer = tableFeaturesLayers
        .find(l => l.id === activeTable);
    const activeTableDataSelected = activeTableFeatureLayer
        ? activeTableFeatureLayer.data.some(d => d._selected)
        : false;
    const layer = layerList
        .find(l => l.id === layerId);
    const activeTableLayer = layerList
        .find(l => l.id === activeTable && l.type === 'agfs' && l.layers);

    const { addressField, featureType } = layerId
    && layerList.find(l => l.id === layerId);

    const parentLayer = nestedVal(layerList.find(l => l.id === activeTable.replace('.s', '')), ['parentLayer']);
    const currentTabAdmin = parentLayer
        ? parentLayer.replace('.s', '') === layerId.replace('.s', '')
        : activeTable.replace('.s', '') === layerId.replace('.s', '');

    const selectedAdminData = tableFeaturesLayers
        .filter(l => l.id === activeTable)
        .flatMap(f => f.data.filter(d => d._selected));

    return {
        isOpen: state.table.toggleTable,
        isOpenFilter: state.table.toggleFilter,
        activeModal: state.modal.activeModal.activeModal,
        activeDelete: layer && currentTabAdmin ? layer.layerPermission.deleteLayer : false,
        originalLayers,
        selectedAdminData: selectedAdminData.length > 0,
        geometryDataSelected: geometryDataSelected.length > 0,
        geometryData: geometryDataSelected,
        activeTableDataSelected,
        activeTableLayer,
        featureType,
        addressField,
        view: state.map.mapView.view,
        editedLayers: [state.table.features.editedLayers
            .find(editedLayer => editedLayer.id.replace('.s', '') === activeTable.replace('.s', ''))],
        currentTabAdmin,
        activeAdminTool: layerId,
        viewGraphics: state.map.mapView.view
            ? state.map.mapView.view.graphics._items
            : [],
        hasTableEdited: state.table.features.hasTableEdited,
        portalIsOpen: state.portal.togglePortal,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleTable: () => {
        dispatch(toggleTable());
    },
    toggleFilter: () => {
        dispatch(toggleFilter());
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    clearTableData: () => {
        dispatch(clearTableData());
    },
    saveEditedFeatures: (view, editedLayers, featureType, addressField) => {
        dispatch(saveEditedFeatures(view, editedLayers, featureType, addressField));
    },
    setButtonAmount: (buttonAmount: ?number) => {
        dispatch(setButtonAmount(buttonAmount));
    },
    togglePortal: () => {
        dispatch(togglePortal());
    },
    updatePortal: () => {
        dispatch(updatePortal());
    },
});

const TableButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(TableButtons);

export default TableButtonsContainer;
