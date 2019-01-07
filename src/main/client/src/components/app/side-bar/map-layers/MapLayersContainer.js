// @flow
import { connect } from 'react-redux';
import {
    getLayerGroups,
    getActiveLayerTab,
    setActiveLayerTab,
    toggleLayerLegend,
} from '../../../../reducers/map/actions';
import { setActiveModal, setDropzoneActive } from '../../../../reducers/modal/actions';
import MapLayers from './MapLayers';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups,
    activeTab: state.map.activeLayerTab,
    layerLegendActive: state.map.layerLegend.layerLegendActive,
});

const mapDispatchToProps = dispatch => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
    getActiveLayerTab: () => {
        dispatch(getActiveLayerTab());
    },
    setActiveLayerTab: (tab) => {
        dispatch(setActiveLayerTab(tab));
    },
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    setDropzoneActive: () => {
        dispatch(setDropzoneActive());
    },
    toggleLayerLegend: () => {
        dispatch(toggleLayerLegend());
    },
});

const MapLayersContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayers);

export default MapLayersContainer;
