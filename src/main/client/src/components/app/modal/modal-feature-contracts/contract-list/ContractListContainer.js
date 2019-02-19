// @flow
import { connect } from 'react-redux';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../../utils/nestedValue';
import ContractList from './ContractList';
import { showConfirmModal } from '../../../../../reducers/confirmModal/actions';
import { setActiveModal } from '../../../../../reducers/modal/actions';

const mapStateToProps = (state) => {
    const { layerId, objectId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;
    const { currentLayer, contractLayer } = getContractLayers(layerId, layerList);

    const editLayerPermission = state.adminTool.active.layerId === layerId &&
        nestedVal(currentLayer, ['layerPermission', 'updateLayer']) &&
        nestedVal(contractLayer, ['layerPermission', 'updateLayer']);

    return {
        objectId,
        currentLayer,
        contractLayer,
        contractIdField: nestedVal(contractLayer, ['contractIdField']),
        contractDescriptionField: nestedVal(contractLayer, ['contractDescriptionField']),
        contractUnlinkable: nestedVal(currentLayer, ['relationType']) === 'many',
        alfrescoLinkField: nestedVal(contractLayer, ['alfrescoLinkField']),
        caseManagementLinkField: nestedVal(contractLayer, ['caseManagementLinkField']),
        editLayerPermission,
    };
};

const mapDispatchToProps = dispatch => ({
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    setActiveModal: (activeModal: string, data: Object[]) => {
        dispatch(setActiveModal(activeModal, data));
    },
});

const ContractListContainer = connect(mapStateToProps, mapDispatchToProps)(ContractList);

export default ContractListContainer;
