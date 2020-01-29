// @flow
import { connect } from 'react-redux';
import ModalExtractSelected from './ModalExtractSelected';

const mapStateToProps = (state) => {
    const selectedGeometryData = [];
    const layer = state.table.features.layers.find(l => l.id === state.table.features.activeTable);
    if (layer) layer.data.forEach(d => d._selected && selectedGeometryData.push(d.geometry));

    const activeTableLayer = state.map.layerGroups.layerList
        .find(l => l.id === state.table.features.activeTable && l.type === 'agfs');
    const layerId = activeTableLayer ? activeTableLayer.id : null;

    return {
        selectedGeometryData,
        layerId,
        extractServiceUrl: state.map.mapConfig.extractServiceUrl,
    };
};

const ModalExtractSelectedContainer = (connect(mapStateToProps)(ModalExtractSelected): any);

export default ModalExtractSelectedContainer;
