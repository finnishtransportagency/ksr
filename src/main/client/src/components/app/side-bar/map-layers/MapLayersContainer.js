// @flow
import { connect } from 'react-redux';
import { getLayerGroups } from '../../../../reducers/map/actions';
import MapLayers from './MapLayers';

const mapStateToProps = state => ({
    layerGroups: state.map.layerGroups,
});

const mapDispatchToProps = dispatch => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
});

const MapLayersContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayers);

export default MapLayersContainer;
