// @flow
import { connect } from 'react-redux';
import { getWmsLayers, getWmtsLayers } from '../../../reducers/map/actions';
import { getActiveNav } from '../../../reducers/navigation/actions';
import EsriMap from './EsriMap';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
    wmsLayers: state.map.wmsLayers,
    wmtsLayers: state.map.wmtsLayers,
});

const mapDispatchToProps = dispatch => ({
    getActiveNav: () => {
        dispatch(getActiveNav());
    },
    getWmsLayers: () => {
        dispatch(getWmsLayers());
    },
    getWmtsLayers: () => {
        dispatch(getWmtsLayers());
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
