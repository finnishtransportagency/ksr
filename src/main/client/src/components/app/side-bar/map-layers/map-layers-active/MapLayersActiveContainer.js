// @flow
import { connect } from 'react-redux';
import { setActiveLayerTab, setLayerList } from '../../../../../reducers/map/actions';
import MapLayersActive from './MapLayersActive';

const mapStateToProps = state => ({
    activeTab: state.map.activeLayerTab,
    layerGroups: state.map.layerGroups,
});

const mapDispatchToProps = dispatch => ({
    setActiveLayerTab: (tab) => {
        dispatch(setActiveLayerTab(tab));
    },
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
});

const MapLayersActiveContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersActive);

export default MapLayersActiveContainer;
