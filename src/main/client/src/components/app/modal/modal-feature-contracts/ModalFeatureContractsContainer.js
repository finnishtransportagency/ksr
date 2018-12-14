// @flow
import { connect } from 'react-redux';
import { removeContractListInfo } from '../../../../reducers/contract/actions';
import ModalFeatureContracts from './ModalFeatureContracts';
import { getContractLayers } from '../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../utils/nestedValue';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;

    const {
        currentLayer, contractLayer,
    } = getContractLayers(layerId, state.map.layerGroups.layerList);

    const createLayerPermission = state.adminTool.active.layerId === layerId &&
        nestedVal(currentLayer, ['layerPermission', 'updateLayer']) &&
        nestedVal(contractLayer, ['layerPermission', 'createLayer']);

    const editLayerPermission = state.adminTool.active.layerId === layerId &&
        nestedVal(currentLayer, ['layerPermission', 'updateLayer']) &&
        nestedVal(contractLayer, ['layerPermission', 'updateLayer']);

    return {
        objectId: state.contract.contractList.objectId,
        currentLayer,
        contractLayer,
        addressField: currentLayer && currentLayer.addressField,
        featureType: currentLayer && currentLayer.featureType,
        view: state.map.mapView.view,
        createLayerPermission,
        editLayerPermission,
    };
};

const mapDispatchToProps = dispatch => ({
    removeContractListInfo: () => {
        dispatch(removeContractListInfo());
    },
});

const ModalFeatureContractsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalFeatureContracts);

export default ModalFeatureContractsContainer;
