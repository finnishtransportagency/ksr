// @flow
import { connect } from 'react-redux';
import {
    getLayerGroups,
    getActiveLayerTab,
    setActiveLayerTab,
    toggleLayerLegend,
    toggleIndexMap,
} from '../../../../reducers/map/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import MapLayers from './MapLayers';

const mapStateToProps = (state: Object) => ({
    layerGroups: state.map.layerGroups,
    activeTab: state.map.activeLayerTab,
    layerLegendActive: state.map.layerLegend.layerLegendActive,
    indexMapActive: state.map.indexMap.indexMapActive,
});

const mapDispatchToProps = (dispatch: Function) => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
    getActiveLayerTab: () => {
        dispatch(getActiveLayerTab());
    },
    setActiveLayerTab: (tab: any) => {
        dispatch(setActiveLayerTab(tab));
    },
    setActiveModal: (activeModal: any) => {
        dispatch(setActiveModal(activeModal));
    },
    toggleLayerLegend: () => {
        dispatch(toggleLayerLegend(true));
    },
    toggleIndexMap: () => {
        dispatch(toggleIndexMap());
    },
});

const MapLayersContainer = (connect(mapStateToProps, mapDispatchToProps)(MapLayers): any);

export default MapLayersContainer;
