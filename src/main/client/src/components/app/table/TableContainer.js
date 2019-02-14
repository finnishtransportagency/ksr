// @flow
import { connect } from 'react-redux';
import { showConfirmModal } from '../../../reducers/confirmModal/actions';
import { toggleFilter, toggleTable, clearTableData, saveEditedFeatures } from '../../../reducers/table/actions';
import { setActiveModal } from '../../../reducers/modal/actions';
import TableView from './TableView';

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

    const editedLayersNoUnderscore = state.table.features.editedLayers
        .map(l => removeUnderscore(l));
    const originalLayers = tableFeaturesLayers.map(l => removeUnderscore(l));
    const selectedAdminData = tableFeaturesLayers
        .filter(layer => layer.id === state.adminTool.active.layerId)
        .flatMap(f => f.data.filter(d => d._selected));
    const geometryDataSelected = tableFeaturesLayers
        .flatMap(f => f.data.filter(d => d._selected && d.geometry));
    const activeTableFeatureLayer = tableFeaturesLayers
        .find(l => l.id === state.table.features.activeTable);
    const activeTableDataSelected = activeTableFeatureLayer ?
        activeTableFeatureLayer.data.some(d => d._selected) : false;
    const layer = state.map.layerGroups.layerList.find(l =>
        l.id === state.adminTool.active.layerId);
    const activeTableLayer = state.map.layerGroups.layerList
        .find(l => l.id === state.table.features.activeTable && l.type === 'agfs' && l.layers);

    const { addressField, featureType } = state.adminTool.active.layerId
    && state.map.layerGroups.layerList.find(l => l.id === state.adminTool.active.layerId);

    const currentTabAdmin = state.table.features.activeTable === state.adminTool.active.layerId;

    return {
        isOpen: state.table.toggleTable,
        isOpenFilter: state.table.toggleFilter,
        activeNav: state.navigation.activeNav,
        activeModal: state.modal.activeModal.activeModal,
        activeUpdate: layer && currentTabAdmin ? layer.layerPermission.updateLayer : false,
        activeDelete: layer && currentTabAdmin ? layer.layerPermission.deleteLayer : false,
        originalLayers,
        editedLayersNoUnderscore,
        selectedAdminData: selectedAdminData.length > 0,
        geometryDataSelected: geometryDataSelected.length > 0,
        geometryData: geometryDataSelected,
        activeTableDataSelected,
        activeTableLayer,
        featureType,
        addressField,
        view: state.map.mapView.view,
        editedLayers: state.table.features.editedLayers
            .filter(editedLayer => editedLayer.id === state.adminTool.active.layerId),
        currentTabAdmin,
        activeAdminTool: state.adminTool.active.layerId,
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
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(TableView);

export default TableContainer;
