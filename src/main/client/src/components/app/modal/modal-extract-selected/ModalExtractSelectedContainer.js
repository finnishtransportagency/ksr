// @flow
import { connect } from 'react-redux';
import ModalExtractSelected from './ModalExtractSelected';
import { nestedVal } from '../../../../utils/nestedValue';

const mapStateToProps = (state) => {
    const selectedGeometryData = [];
    const layer = state.table.features.layers.find(l => l.id === state.table.features.activeTable);
    if (layer) layer.data.forEach(d => d._selected && selectedGeometryData.push(d.geometry));

    const { layerList } = state.map.layerGroups;
    const activeTableLayer = state.map.layerGroups.layerList
        .find(l => l.id === state.table.features.activeTable && l.type === 'agfs');
    let layerId = activeTableLayer ? activeTableLayer.id : null;

    // Use parent layers' id for child layer
    if (layerId !== null) {
        const parentLayer = nestedVal(layerList.find(l => l.id === layerId.replace('.s', '')), ['parentLayer']);
        layerId = parentLayer || layerId;
    }

    return {
        selectedGeometryData,
        layerId,
        extractServiceUrl: state.map.mapConfig.extractServiceUrl,
    };
};

const ModalExtractSelectedContainer = (connect(mapStateToProps)(ModalExtractSelected): any);

export default ModalExtractSelectedContainer;
