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

const mapStateToProps = (state: Object) => {
    const removeUnderscore = (layer: any) => {
        const filteredData = [];
        layer.data.map((d) => {
            const filtered = Object.keys(d)
                .filter(key => key.substring(0, 1) !== '_')
                .reduce((obj, key: any) => {
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

    const { addressField, featureType } = layerId
    && layerList.find(l => l.id === layerId);

    let activeTableLayer = layerList
        .find(l => l.id === activeTable && l.type === 'agfs' && l.layers);
    const parentLayer = nestedVal(
        layerList.find(l => l.id === activeTable.replace('_s', '')),
        ['parentLayer'],
    );

    // Find correct layers -data for child layer
    if (!activeTableLayer && parentLayer) {
        activeTableLayer = layerList.find(l => l.id === parentLayer && l.type === 'agfs' && l.layers);
    }

    const currentTabAdmin = parentLayer
        ? parentLayer.replace('_s', '') === layerId.replace('_s', '')
        : activeTable.replace('_s', '') === layerId.replace('_s', '');

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
        editedLayers: state.table.features.editedLayers,
        currentTabAdmin,
        activeAdminTool: layerId,
        viewGraphics: state.map.mapView.view
            ? state.map.mapView.view.graphics._items
            : [],
        hasTableEdited: state.table.features.hasTableEdited,
        portalIsOpen: state.portal.togglePortal,
        layerList,
    };
};

const mapDispatchToProps = (dispatch: Function) => ({
    toggleTable: () => {
        dispatch(toggleTable());
    },
    toggleFilter: () => {
        dispatch(toggleFilter());
    },
    setActiveModal: (activeModal: any) => {
        dispatch(setActiveModal(activeModal));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    clearTableData: (view: any, editedLayers: any, featureType: any, addressField: any, layerList: any, isAdminAgfl: any) => {
        dispatch(
            clearTableData(view, editedLayers, featureType, addressField, layerList, isAdminAgfl),
        );
    },
    saveEditedFeatures: (view: any, editedLayers: any, featureType: any, addressField: any) => {
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

const TableButtonsContainer: any = connect(mapStateToProps, mapDispatchToProps)(TableButtons);

export default TableButtonsContainer;
