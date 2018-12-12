// @flow
import { connect } from 'react-redux';
import { nestedVal } from '../../../../../utils/nestedValue';
import ContractList from './ContractList';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const currentLayer = layerId && state.map.layerGroups.layerList
        .find(layer => layer.id === layerId.replace('.s', ''));
    const relationLayer = currentLayer && state.map.layerGroups.layerList
        .find(layer => layer.id === currentLayer.relationLayerId.toString());

    const {
        objectId, contractIdField, contractDescriptionField,
    } = state.contract.contractList;

    return {
        objectId,
        contractIdField,
        contractDescriptionField,
        contractUnlinkable: nestedVal(currentLayer, ['relationType']) === 'many',
        currentLayer,
        relationLayer,
        alfrescoLinkField: nestedVal(currentLayer, ['alfrescoLinkField']),
        caseManagementLinkField: nestedVal(currentLayer, ['caseManagementLinkField']),
    };
};

const ContractListContainer = connect(mapStateToProps, null)(ContractList);

export default ContractListContainer;
