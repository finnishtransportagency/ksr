// @flow
import { connect } from 'react-redux';
import ModalZoomToFeatures from './ModalZoomToFeatures';

const mapStateToProps = (state: Object) => {
    const selectedGeometryData = [];
    if (state.table.features.singleLayerGeometry.type === undefined) {
        state.table.features.layers.forEach((l) => {
            l.data.forEach(d => d._selected && d.geometry
                && selectedGeometryData.push({
                    geometry: d.geometry,
                    layerId: d._layerId,
                }));
        });
    } else {
        selectedGeometryData.push(state.table.features.singleLayerGeometry);
    }

    const tableGeometryData = [];
    state.table.features.layers.forEach((l) => {
        l.data.forEach(d => d.geometry
            && tableGeometryData.push({
                geometry: d.geometry,
                layerId: d._layerId,
            }));
    });

    const activeTableLayer = state.map.layerGroups.layerList
        .find(l => l.id === state.table.features.activeTable
            && l.type === 'agfs'
            && (l.layers || l.parentLayer || l._source === 'search'));

    return {
        tableGeometryData,
        selectedGeometryData,
        view: state.map.mapView.view,
        activeLayerId: activeTableLayer && activeTableLayer.id,
    };
};

const ModalZoomToFeaturesContainer: any = connect(mapStateToProps)(ModalZoomToFeatures);

export default ModalZoomToFeaturesContainer;
