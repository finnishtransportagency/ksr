// @flow
import { connect } from 'react-redux';
import { activateLayers, deactivateLayer } from '../../../../../reducers/map/actions';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import MapLayersAll from './MapLayersAll';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups.layerGroups,
    layerList: state.map.layerGroups.layerList,
    subLayers: state.map.layerGroups.layerList.filter(ll => ll.parentLayer),
    fetching: state.map.layerGroups.fetching,
    activeAdminTool: state.adminTool.active.layerId,
    view: state.map.mapView.view,
    loadingLayers: state.loading.loadingLayers,
});

const mapDispatchToProps = dispatch => ({
    setActiveAdminTool: (layerId, layerList) => {
        dispatch(setActiveAdminTool(layerId, layerList));
    },
    activateLayers: (layers) => {
        dispatch(activateLayers(layers));
    },
    deactivateLayer: (layerId) => {
        dispatch(deactivateLayer(layerId));
    },
});

const MapLayersAllContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersAll);

export default MapLayersAllContainer;
