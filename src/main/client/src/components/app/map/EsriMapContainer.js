// @flow
import { connect } from 'react-redux';
import { getLayerGroups } from '../../../reducers/map/actions';
import EsriMap from './EsriMap';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
    wmsLayers: state.map.wmsLayers,
    layerGroups: state.map.layerGroups,
});

const mapDispatchToProps = dispatch => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
