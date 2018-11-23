// @flow
import { connect } from 'react-redux';
import ContractList from './ContractList';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const currentLayer = layerId && state.map.layerGroups.layerList
        .find(layer => layer.id === layerId.replace('.s', ''));
    const relationLayer = currentLayer && state.map.layerGroups.layerList
        .find(layer => layer.id === currentLayer.relationLayerId.toString());

    return {
        objectId: state.contract.contractList.objectId,
        contractIdField: state.contract.contractList.contractIdField,
        contractDescriptionField: state.contract.contractList.contractDescriptionField,
        contractUnlinkable: currentLayer && currentLayer.relationType === 'many',
        currentLayer,
        relationLayer,
    };
};

const ContractListContainer = connect(mapStateToProps, null)(ContractList);

export default ContractListContainer;
