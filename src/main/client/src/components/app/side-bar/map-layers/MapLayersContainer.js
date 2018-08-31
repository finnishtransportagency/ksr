// @flow
import { connect } from 'react-redux';
import { getLayerGroups, getActiveLayerTab, setActiveLayerTab } from '../../../../reducers/map/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import MapLayers from './MapLayers';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups,
    activeTab: state.map.activeLayerTab,
    activeModal: state.modal.activeModal,
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
});

const MapLayersContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayers);

export default MapLayersContainer;
