// @flow
import { connect } from 'react-redux';
import { saveDeletedFeatures } from '../../../../reducers/table/actions';
import { getCodedValue } from '../../../../utils/parseFeatureData';
import ModalDeleteSelected from './ModalDeleteSelected';

const mapStateToProps = (state) => {
    const { layerList } = state.map.layerGroups;
    const { layerId } = state.adminTool.active;
    const { layers } = state.table.features;
    const { activeTable } = state.table.features;

    const selectedData = layers
        .filter(layer => activeTable.replace('.s', '') === layer.id.replace('.s', ''))
        .flatMap(layer => layer.data)
        .filter(data => data._selected);

    const { queryColumnsList } = layerList
        .find(lg => lg.id === layerId);

    const layer = state.map.layerGroups.layerList
        .find(l => l.id === state.adminTool.active.layerId);

    const columns = (queryColumnsList.length > 0) ? queryColumnsList : Object.keys(selectedData[0])
        .filter((key, index) => key.includes('/') && index < 5);

    const filteredData = [];
    selectedData.map((d) => {
        const filtered = Object.keys(d)
            .filter(key => columns.find(qc => key.includes(qc) || key === '_id'))
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
        layerId,
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
