// @flow
import { connect } from 'react-redux';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import LinkContract from './LinkContract';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;

    const {
        contractLayer,
    } = getContractLayers(layerId, layerList);

    return {
        contractLayer,
    };
};

const ContractListContainer = connect(mapStateToProps, null)(LinkContract);

export default ContractListContainer;
