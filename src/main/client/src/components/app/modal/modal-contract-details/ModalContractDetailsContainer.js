// @flow
import { connect } from 'react-redux';
import ModalContractDetails from './ModalContractDetails';
import { setActiveModal } from '../../../../reducers/modal/actions';
import { updateLayerFields } from '../../../../reducers/map/actions';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';

const mapStateToProps = (state) => {
    const { layerId, contractObjectId, source } = state.modal.activeModal.data;
    const { layerList } = state.map.layerGroups;
    const { layerId: activeAdmin } = state.adminTool.active;
    const contractLayer = layerList.find(l => l.id === layerId);
    const tableFeaturesLayers = state.table.features.layers;
    const { view } = state.map.mapView;

    return {
        contractLayer,
        contractObjectId,
        source,
        layerList,
        activeAdmin,
        tableFeaturesLayers,
        view,
    };
};

const mapDispatchToProps = dispatch => ({
    setActiveModal: (activeModal: string) => {
        dispatch(setActiveModal(activeModal));
    },
    updateLayerFields: (layerId: string, fields: Object[]) => {
        dispatch(updateLayerFields(layerId, fields));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
});

const ModalContractDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalContractDetails);

export default ModalContractDetailsContainer;
