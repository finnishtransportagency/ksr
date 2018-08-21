// @flow
import { connect } from 'react-redux';
import { getLayerGroups, setLayerList } from '../../../../../reducers/map/actions';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import MapLayersAll from './MapLayersAll';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups.layerGroups,
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching,
    adminToolActive: state.adminTool.active.layerId,
});

const mapDispatchToProps = dispatch => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
    setActiveAdminTool: (layerId, layerList) => {
        dispatch(setActiveAdminTool(layerId, layerList));
    },
});

const MapLayersAllContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersAll);

export default MapLayersAllContainer;
