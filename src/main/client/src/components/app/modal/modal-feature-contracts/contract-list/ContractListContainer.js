// @flow
import { connect } from 'react-redux';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../../utils/nestedValue';
import ContractList from './ContractList';
import { showConfirmModal } from '../../../../../reducers/confirmModal/actions';
import { setActiveModal } from '../../../../../reducers/modal/actions';
import { updateRelatedLayersData } from '../../../../../reducers/map/actions';

const mapStateToProps = (state: Object) => {
    const { layerId, objectId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;
    const { currentLayer, contractLayers } = getContractLayers(layerId, layerList);

    const editLayerPermission = state.adminTool.active.layerId === layerId
        && nestedVal(currentLayer, ['layerPermission', 'updateLayer'])
        && contractLayers.every(c => nestedVal(c, ['layerPermission', 'updateLayer']));

    return {
        objectId,
        currentLayer,
        contractLayers,
        editLayerPermission,
        layerList,
    };
};

const mapDispatchToProps = (dispatch: Function) => ({
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    setActiveModal: (activeModal: string, data: any) => {
        dispatch(setActiveModal(activeModal, data));
    },
    updateLayerData: (layer: Object) => {
        dispatch(updateRelatedLayersData([layer]));
    },
});

const ContractListContainer = (connect(mapStateToProps, mapDispatchToProps)(ContractList): any);

export default ContractListContainer;
