// @flow
import { connect } from 'react-redux';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../../utils/nestedValue';
import ContractList from './ContractList';

const mapStateToProps = (state) => {
    const { layerId, objectId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;

    const {
        currentLayer, contractLinkLayer, contractLayer,
    } = getContractLayers(layerId, layerList);

    return {
        objectId,
        currentLayer,
        contractLinkLayer,
        contractLayer,
        contractIdField: nestedVal(contractLayer, ['contractIdField']),
        contractDescriptionField: nestedVal(contractLayer, ['contractDescriptionField']),
        contractUnlinkable: nestedVal(currentLayer, ['relationType']) === 'many',
        alfrescoLinkField: nestedVal(contractLayer, ['alfrescoLinkField']),
        caseManagementLinkField: nestedVal(contractLayer, ['caseManagementLinkField']),
    };
};

const ContractListContainer = connect(mapStateToProps, null)(ContractList);

export default ContractListContainer;
