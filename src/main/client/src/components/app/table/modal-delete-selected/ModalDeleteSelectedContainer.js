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

    return {
        selectedData,
    };
};

const mapDispatchToProps = dispatch => ({
    deleteSelectedData: (selectedData: Array<Object>) => {
        dispatch(deleteSelectedData(selectedData));
    },
});

const ModalDeleteSelectedContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalDeleteSelected);

export default ModalDeleteSelectedContainer;
