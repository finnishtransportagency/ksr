// @flow
import { connect } from 'react-redux';
import { setLayerList } from '../../../../../reducers/map/actions';
import { setLoading, removeLoading } from '../../../../../reducers/loading/actions';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import { addNonSpatialContentToTable } from '../../../../../reducers/table/actions';
import MapLayersAll from './MapLayersAll';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups.layerGroups,
    layerList: state.map.layerGroups.layerList,
    subLayers: state.map.layerGroups.layerList.filter(ll => ll.parentLayer),
    fetching: state.map.layerGroups.fetching,
    activeAdminTool: state.adminTool.active.layerId,
    view: state.map.mapView.view,
});

const mapDispatchToProps = dispatch => ({
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
    setActiveAdminTool: (layerId, layerList) => {
        dispatch(setActiveAdminTool(layerId, layerList));
    },
    addNonSpatialContentToTable: (layer) => {
        dispatch(addNonSpatialContentToTable(layer));
    },
    setLoading: () => {
        dispatch(setLoading());
    },
    removeLoading: () => {
        dispatch(removeLoading());
    },
});

const MapLayersAllContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersAll);

export default MapLayersAllContainer;
