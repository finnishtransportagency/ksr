// @flow
import { connect } from 'react-redux';
import { saveDeletedFeatures } from '../../../../reducers/table/actions';
import { getCodedValue } from '../../../../utils/parseFeatureData';
import ModalDeleteSelected from './ModalDeleteSelected';
import { nestedVal } from '../../../../utils/nestedValue';

const mapStateToProps = (state: Object) => {
    const { layerList } = state.map.layerGroups;
    const { layerId } = state.adminTool.active;
    const { layers } = state.table.features;
    const { activeTable } = state.table.features;

    const selectedData = layers
        .filter(layer => activeTable.replace('_s', '') === layer.id.replace('_s', ''))
        .flatMap(layer => layer.data)
        .filter(data => data._selected);

    const { queryColumnsList } = layerList
        .find(lg => lg.id === layerId);

    const layer = state.map.layerGroups.layerList
        .find(l => l.id === state.adminTool.active.layerId);

    const columns = (queryColumnsList.length > 0) ? queryColumnsList : Object.keys(selectedData[0])
        .filter((key, index) => key.includes('/') && index < 5);

    const oidField = nestedVal(layer.fields.find(a => a.type === 'esriFieldTypeOID'), ['name']);
    const filteredData = selectedData.map(d => Object.keys(d)
        .filter(key => columns.find(qc => key.includes(qc)
            || key.split('/').pop() === oidField))
        .reduce((obj: any, key) => {
            if (key.split('/').pop() === oidField) {
                obj._id = d[key];
            } else {
                const attributeName = key.split('/').pop();
                const layerFieldInfo = layer.fields.find(field => field.name === attributeName);

                const label = layerFieldInfo ? layerFieldInfo.label : attributeName;
                const domain = layerFieldInfo && layerFieldInfo.domain ? layerFieldInfo.domain : {};
                obj[label] = getCodedValue(domain, d[key]);
            }
            return obj;
        }, {}));

    return {
        filteredData,
        view: state.map.mapView.view,
        layerId,
    };
};

const mapDispatchToProps = (dispatch: Function) => ({
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
