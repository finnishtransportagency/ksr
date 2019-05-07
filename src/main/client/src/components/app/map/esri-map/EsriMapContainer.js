// @flow
import { connect } from 'react-redux';
import EsriMap from './EsriMap';

const mapStateToProps = (state) => {
    const selectedFeatures = state.table.features.layers
        .reduce((a, b) => a.concat(b.data.filter(d => d._selected)), []);

    return ({
        view: state.map.mapView.view,
        activeNav: state.navigation.activeNav,
        layerList: state.map.layerGroups.layerList,
        isOpenTable: state.table.toggleTable,
        selectedFeatures,
        activeAdminTool: state.adminTool.active.layerId,
        layers: state.table.features.layers,
        loadingWorkspace: state.workspace.workspace.loadingWorkspace,
        layerLegendActive: state.map.layerLegend.layerLegendActive,
    });
};

const EsriMapContainer = connect(mapStateToProps)(EsriMap);

export default EsriMapContainer;
