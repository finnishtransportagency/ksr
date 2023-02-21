// @flow
import { connect } from 'react-redux';
import { removeContractListInfo } from '../../../../reducers/contract/actions';
import ModalFeatureContracts from './ModalFeatureContracts';
import { getContractLayers } from '../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../utils/nestedValue';
import { updateRelatedLayersData, updateLayerFields } from '../../../../reducers/map/actions';

const mapStateToProps = (state: Object) => {
    const { layerId } = state.contract.contractList;

    const {
        currentLayer, contractLayers,
    } = getContractLayers(layerId, state.map.layerGroups.layerList);

    const createLayerPermission = state.adminTool.active.layerId === layerId
        && nestedVal(currentLayer, ['layerPermission', 'updateLayer'])
        && contractLayers.every(c => nestedVal(c, ['layerPermission', 'createLayer']));

    const editLayerPermission = state.adminTool.active.layerId === layerId
        && nestedVal(currentLayer, ['layerPermission', 'updateLayer'])
        && contractLayers.every(c => nestedVal(c, ['layerPermission', 'updateLayer']));

    return {
        objectId: state.contract.contractList.objectId,
        currentLayer,
        contractLayers,
        view: state.map.mapView.view,
        createLayerPermission,
        editLayerPermission,
    };
};

const mapDispatchToProps = (dispatch: Function) => ({
    removeContractListInfo: () => {
        dispatch(removeContractListInfo());
    },
    updateLayerFields: (layerId: any, fields: any) => {
        dispatch(updateLayerFields(layerId, fields));
    },
    updateLayerData: (layer: any) => {
        dispatch(updateRelatedLayersData([layer]));
    },
});

const ModalFeatureContractsContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalFeatureContracts): any);

export default ModalFeatureContractsContainer;
