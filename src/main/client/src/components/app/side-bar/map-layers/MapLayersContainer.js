// @flow
import { connect } from 'react-redux';
import { getLayerGroups, getActiveLayerTab, setActiveLayerTab } from '../../../../reducers/map/actions';
import MapLayers from './MapLayers';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups,
    activeTab: state.map.activeLayerTab,
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
});

const MapLayersContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayers);

export default MapLayersContainer;
