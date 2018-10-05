// @flow
import { connect } from 'react-redux';
import { removeLayersView } from '../../../../reducers/map/actions';
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
    });
};

const mapDispatchToProps = dispatch => ({
    removeLayersView: (layerIds) => {
        dispatch(removeLayersView(layerIds));
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
