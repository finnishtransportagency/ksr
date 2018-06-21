// @flow
import { connect } from 'react-redux';
import { setLayerList } from '../../../../../reducers/map/actions';
import MapLayersActive from './MapLayersActive';

const mapStateToProps = state => ({
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching,
});

const mapDispatchToProps = dispatch => ({
    setLayerList: (layerList) => {
        dispatch(setLayerList(layerList));
    },
});

const MapLayersActiveContainer = connect(mapStateToProps, mapDispatchToProps)(MapLayersActive);

export default MapLayersActiveContainer;
