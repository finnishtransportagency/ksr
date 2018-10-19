// @flow
import { connect } from 'react-redux';
import { toggleFilter, toggleTable } from '../../../reducers/table/actions';
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

    const editedLayers = state.table.features.editedLayers.map(l => removeUnderscore(l));
    const originalLayers = state.table.features.layers.map(l => removeUnderscore(l));
    const selectedData = state.table.features.layers.reduce((a, b) => (
        b.type !== 'agfl' ? a.concat(b.data.filter(d => d._selected)) : a
    ), []);

    const layer = state.map.layerGroups.layerList.find(l =>
        l.id === state.adminTool.active.layerId);

    return {
        isOpen: state.table.toggleTable,
        isOpenFilter: state.table.toggleFilter,
        activeNav: state.navigation.activeNav,
        activeModal: state.modal.activeModal.activeModal,
        activeUpdate: layer ? layer.layerPermission.updateLayer : false,
        activeDelete: layer ? layer.layerPermission.deleteLayer : false,
        originalLayers,
        editedLayers,
        selectedData: selectedData.length > 0,
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
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(TableView);

export default TableContainer;
