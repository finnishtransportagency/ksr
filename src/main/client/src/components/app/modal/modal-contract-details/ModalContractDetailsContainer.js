// @flow
import { connect } from 'react-redux';
import ModalContractDetails from './ModalContractDetails';
import { setActiveModal } from '../../../../reducers/modal/actions';
import { updateLayerFields } from '../../../../reducers/map/actions';

const mapStateToProps = (state) => {
    const { layerId, contractObjectId, source } = state.modal.activeModal.data;
    const { layerList } = state.map.layerGroups;

    return {
        layerId,
        contractObjectId,
        source,
        layerList,
    };
};

const mapDispatchToProps = dispatch => ({
    setActiveModal: (activeModal: string) => {
        dispatch(setActiveModal(activeModal));
    },
    updateLayerFields: (layerId: string, fields: Object[]) => {
        dispatch(updateLayerFields(layerId, fields));
    },
});

const ModalContractDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalContractDetails);

export default ModalContractDetailsContainer;
