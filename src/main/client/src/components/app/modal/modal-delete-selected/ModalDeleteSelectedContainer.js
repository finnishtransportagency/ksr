// @flow
import { connect } from 'react-redux';
import { deleteSelectedData } from '../../../../reducers/adminTool/actions';
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
            .filter(key => queryColumns.find(qc => qc === key || key === '_id'))
            .reduce((obj, key) => {
                obj[key] = d[key];
                return obj;
            }, {});

        return filteredData.push(filtered);
    });

    return {
        selectedData,
        filteredData,
    };
};

const mapDispatchToProps = dispatch => ({
    deleteSelectedData: (selectedData: Array<Object>, deleteComment: string) => {
        dispatch(deleteSelectedData(selectedData, deleteComment));
    },
});

const ModalDeleteSelectedContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalDeleteSelected);

export default ModalDeleteSelectedContainer;
