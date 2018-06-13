// @flow
import { connect } from 'react-redux';
import EsriMap from './EsriMap';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
    wmsLayers: state.map.wmsLayers,
    layerGroups: state.map.layerGroups,
});

const EsriMapContainer = connect(mapStateToProps)(EsriMap);

export default EsriMapContainer;
