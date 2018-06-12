// @flow
import { connect } from 'react-redux';
import { setActiveLayerTab, getActiveLayers } from '../../../../../reducers/map/actions';
import MapLayersActive from './MapLayersActive';

const mapStateToProps = state => ({
    activeTab: state.map.activeLayerTab,
    activeLayers: state.map.activeLayers,
});

const mapDispatchToProps = dispatch => ({
    setActiveLayerTab: (tab) => {
        dispatch(setActiveLayerTab(tab));
    },
    getActiveLayers: () => {
        dispatch(getActiveLayers());
    },
});

const MapLayersActiveContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersActive);

export default MapLayersActiveContainer;
