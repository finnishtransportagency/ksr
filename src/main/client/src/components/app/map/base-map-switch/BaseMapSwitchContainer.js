// @flow
import { connect } from 'react-redux';
import BaseMapSwitchView from './BaseMapSwitchView';
import { activateLayers, toggleLayer } from '../../../../reducers/map/actions';

const sortNames = (a, b) => {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    if (aLower < bLower) return -1;
    if (aLower > bLower) return 1;
    return 0;
};

const mapStateToProps = state => ({
    layers: state.map.layerGroups.layerList
        .filter(l => l.background && l.name !== null)
        .sort(sortNames),
    tableOpen: state.table.toggleTable,
    sideBarOpen: (
        state.navigation.activeNav === 'search'
        || state.navigation.activeNav === 'mapLayers'
        || state.navigation.activeNav === 'workspace'
        || state.navigation.activeNav === 'offline'
    ),
    adminToolActive: state.adminTool.active.layerId !== '',
    loadingLayers: state.loading.loadingLayers,
    tableButtonAmount: state.table.buttonAmount,
});

const mapDispatchToProps = dispatch => ({
    toggleLayer: (layerId) => {
        dispatch(toggleLayer(layerId));
    },
    activateLayers: (layers) => {
        dispatch(activateLayers(layers));
    },
});

const BaseMapSwitchContainer = connect(mapStateToProps, mapDispatchToProps)(BaseMapSwitchView);

export default BaseMapSwitchContainer;
