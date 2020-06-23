// @flow
import { connect } from 'react-redux';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import LinkContract from './LinkContract';
import { findFirstContractLayer } from '../../../../../utils/layers';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;

    const {
        contractLayers,
    } = getContractLayers(layerId, layerList);

    return {
        contractLayer: findFirstContractLayer(contractLayers),
    };
};

const ContractListContainer = (connect(mapStateToProps)(LinkContract): any);

export default ContractListContainer;
