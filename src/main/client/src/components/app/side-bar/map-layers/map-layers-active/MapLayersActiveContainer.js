// @flow
import { connect } from 'react-redux';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import { setLayerList } from '../../../../../reducers/map/actions';
import MapLayersActive from './MapLayersActive';

const mapStateToProps = state => ({
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching,
    activeAdminTool: state.adminTool.active.layerId,
});

const mapDispatchToProps = dispatch => ({
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
    setActiveAdminTool: (layerId, layerList) => {
        dispatch(setActiveAdminTool(layerId, layerList));
    },
});

const MapLayersActiveContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersActive);

export default MapLayersActiveContainer;
