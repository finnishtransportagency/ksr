// @flow
import { connect } from 'react-redux';
import { getLayerGroups } from '../../../reducers/map/actions';
import { getActiveNav } from '../../../reducers/navigation/actions';
import EsriMap from './EsriMap';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
    layerGroups: state.map.layerGroups,
    isOpenTable: state.table.toggleTable,
});

const mapDispatchToProps = dispatch => ({
    getActiveNav: () => {
        dispatch(getActiveNav());
    },
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
