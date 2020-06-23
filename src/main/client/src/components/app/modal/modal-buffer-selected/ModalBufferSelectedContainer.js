// @flow
import { connect } from 'react-redux';
import ModalBufferSelected from './ModalBufferSelected';
import { setSingleLayerGeometry } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const singleFeature = state.table.features.singleLayerGeometry.type !== undefined;
    const selectedGeometryData = [];
    if (singleFeature) {
        selectedGeometryData.push(state.table.features.singleLayerGeometry);
    } else {
        state.table.features.layers.forEach((l) => {
            l.data.forEach(d => d._selected && d.geometry
                && selectedGeometryData.push({
                    geometry: d.geometry,
                    layerId: d._layerId,
                }));
        });
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
        singleFeature,
    };
};
const mapDispatchToProps = dispatch => ({
    setSingleLayerGeometry: (geometry) => {
        dispatch(setSingleLayerGeometry(geometry));
    },
});

const ModalBufferSelectedContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalBufferSelected): any);

export default ModalBufferSelectedContainer;
