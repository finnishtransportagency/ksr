// @flow
import { connect } from 'react-redux';
import EsriMap from './EsriMap';

const mapStateToProps = state => ({
    activeNav: state.navigation.activeNav,
    layerList: state.map.layerGroups.layerList,
    fetching: state.map.layerGroups.fetching,
    isOpenTable: state.table.toggleTable,
});

const EsriMapContainer = connect(mapStateToProps)(EsriMap);

export default EsriMapContainer;
