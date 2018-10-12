// @flow
import { connect } from 'react-redux';
import { saveDeletedFeatures } from '../../../../reducers/table/actions';
import ModalDeleteSelected from './ModalDeleteSelected';

const mapStateToProps = (state) => {
    const selectedData = [];

    state.table.features.layers.forEach((l) => {
        l.data.forEach(d => d._selected && !selectedData
            .find(sd => sd._id === d._id) && selectedData.push(d));
    });

    const { queryColumns } = state.map.layerGroups.layerList
        .find(lg => lg.id === state.adminTool.active.layerId);

    const filteredData = [];
    selectedData.map((d) => {
        const filtered = Object.keys(d)
            .filter(key => queryColumns.find(qc => qc === key || key === '_id' || key.includes('/')))
            .reduce((obj, key) => {
                obj[key.split('/').pop()] = d[key];
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

const ModalDeleteSelectedContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalDeleteSelected);

export default ModalDeleteSelectedContainer;
