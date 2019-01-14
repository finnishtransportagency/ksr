// @flow
import { connect } from 'react-redux';
import { removeLayersView, setLayerList } from '../../../../reducers/map/actions';
import EsriMap from './EsriMap';
import { removeLoading } from '../../../../reducers/loading/actions';

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

const mapDispatchToProps = dispatch => ({
    removeLayersView: (layerIds) => {
        dispatch(removeLayersView(layerIds));
    },
    removeLoading: () => {
        dispatch(removeLoading());
    },
    setLayerList: (layerList: Object[]) => {
        dispatch(setLayerList(layerList));
    },
});

const EsriMapContainer = connect(mapStateToProps, mapDispatchToProps)(EsriMap);

export default EsriMapContainer;
