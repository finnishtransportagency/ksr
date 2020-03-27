// @flow
import { connect } from 'react-redux';
import { saveDeletedFeatures } from '../../../../reducers/table/actions';
import { getCodedValue } from '../../../../utils/parseFeatureData';
import ModalDeleteSelected from './ModalDeleteSelected';

const mapStateToProps = (state) => {
    const selectedData = state.table.features.layers
        .filter(layer => layer.id === state.adminTool.active.layerId)
        .flatMap(layer => layer.data)
        .filter(data => data._selected);

    const { queryColumnsList } = state.map.layerGroups.layerList
        .find(lg => lg.id === state.adminTool.active.layerId);

    const layer = state.map.layerGroups.layerList
        .find(l => l.id === state.adminTool.active.layerId);

    const filteredData = [];
    selectedData.map((d) => {
        const filtered = Object.keys(d)
            .filter(key => queryColumnsList.find(qc => qc === key || key === '_id' || key.includes('/')))
            .reduce((obj, key) => {
                const attributeName = key.split('/').pop();
                const layerFieldInfo = layer.fields
                    .filter(field => field.name === attributeName)[0];
                const label = layerFieldInfo ? layerFieldInfo.label : attributeName;
                const domain = layerFieldInfo && layerFieldInfo.domain ? layerFieldInfo.domain : {};
                const value = getCodedValue(domain, d[key]);
                obj[label] = value;
                return obj;
            }, {});

        return filteredData.push(filtered);
    });

    return {
        filteredData,
        view: state.map.mapView.view,
        layerId: state.adminTool.active.layerId,
    };
};

const mapDispatchToProps = dispatch => ({
    saveDeletedFeatures: (
        view: Object,
        layerId: string,
        objectIds: string,
        deleteComment: string,
    ) => {
        dispatch(saveDeletedFeatures(view, layerId, objectIds, deleteComment));
    },
});

const ModalDeleteSelectedContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalDeleteSelected): any);

export default ModalDeleteSelectedContainer;
