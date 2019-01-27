// @flow
import { connect } from 'react-redux';
import { setActiveAdminTool } from '../../../../../reducers/adminTool/actions';
import { setLayerList, toggleLayer } from '../../../../../reducers/map/actions';
import { setActiveModal } from '../../../../../reducers/modal/actions';
import MapLayersActive from './MapLayersActive';

const mapStateToProps = state => ({
    mapLayerList: state.map.layerGroups.layerList.filter(l => l.type !== 'agfl'),
    dataLayerList: state.map.layerGroups.layerList.filter(l => l.type === 'agfl'),
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
    createNonSpatialFeature: () => {
        dispatch(setActiveModal('editLayerDetails'));
    },
    createThemeLayer: (layerId: string) => {
        dispatch(setActiveModal('themeLayer', layerId));
    },
    toggleLayer: (layerId: string) => {
        dispatch(toggleLayer(layerId));
    },
});

const MapLayersActiveContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersActive);

export default MapLayersActiveContainer;
