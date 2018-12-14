// @flow
import { connect } from 'react-redux';
import AddContract from './AddContract';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../../utils/nestedValue';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;

    const {
        currentLayer, contractLayer,
    } = getContractLayers(layerId, layerList);

    return {
        layerId,
        contractIdField: contractLayer && contractLayer.contractIdField,
        contractDescriptionField: contractLayer && contractLayer.contractDescriptionField,
        contractLayer,
        currentLayer,
        fields: nestedVal(contractLayer, ['fields']),
    };
};

const AddContractContrainer = connect(mapStateToProps, null)(AddContract);

export default AddContractContrainer;
