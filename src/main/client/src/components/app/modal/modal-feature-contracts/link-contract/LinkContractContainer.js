// @flow
import { connect } from 'react-redux';
import LinkContract from './LinkContract';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const currentLayer = layerId && state.map.layerGroups.layerList
        .find(layer => layer.id === layerId.replace('.s', ''));
    const relationLayer = currentLayer && state.map.layerGroups.layerList
        .find(layer => layer.id === currentLayer.relationLayerId.toString());

    return {
        layerId,
        contractIdField: state.contract.contractList.contractIdField,
        contractDescriptionField: state.contract.contractList.contractDescriptionField,
        relationLayer,
        currentLayer,
    };
};

const ContractListContainer = connect(mapStateToProps, null)(LinkContract);

export default ContractListContainer;
