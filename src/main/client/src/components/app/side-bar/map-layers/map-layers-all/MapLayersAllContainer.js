// @flow
import { connect } from 'react-redux';
import { activateLayers, deactivateLayer, hideLayer } from '../../../../../reducers/map/actions';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import MapLayersAll from './MapLayersAll';
import { setSearchFeatures } from '../../../../../reducers/table/actions';

const mapStateToProps = (state: Object) => ({
    layerGroups: state.map.layerGroups.layerGroups,
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching,
    activeAdminTool: state.adminTool.active.layerId,
    view: state.map.mapView.view,
    loadingLayers: state.loading.loadingLayers,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setActiveAdminTool: (layerId: any, layerList: any) => {
        dispatch(setActiveAdminTool(layerId, layerList));
    },
    activateLayers: (layers: any) => {
        dispatch(activateLayers(layers));
    },
    deactivateLayer: (layerId: any) => {
        dispatch(deactivateLayer(layerId));
    },
    setSearchFeatures: (layers: any) => {
        dispatch(setSearchFeatures(layers));
    },
    hideLayer: (layerIds: string[]) => {
        dispatch(hideLayer(layerIds));
    },
});

const MapLayersAllContainer = (connect(mapStateToProps, mapDispatchToProps)(MapLayersAll): any);

export default MapLayersAllContainer;
