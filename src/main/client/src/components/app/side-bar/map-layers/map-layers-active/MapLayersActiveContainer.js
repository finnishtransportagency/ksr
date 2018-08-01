// @flow
import { connect } from 'react-redux';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import { setLayerList } from '../../../../../reducers/map/actions';
import MapLayersActive from './MapLayersActive';

const mapStateToProps = state => ({
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching,
    adminToolActive: state.adminTool.active,
});

const mapDispatchToProps = dispatch => ({
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
    setActiveAdminTool: (layerId) => {
        dispatch(setActiveAdminTool(layerId));
    },
});

const MapLayersActiveContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersActive);

export default MapLayersActiveContainer;
