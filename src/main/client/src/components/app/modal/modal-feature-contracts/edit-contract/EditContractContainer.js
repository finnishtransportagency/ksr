// @flow
import { connect } from 'react-redux';
import EditContract from './EditContract';
import { getContractLayers } from '../../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../../utils/nestedValue';

const mapStateToProps = (state) => {
    const { layerId, objectId } = state.contract.contractList;
    const { layerList } = state.map.layerGroups;

    const {
        currentLayer, contractLayer,
    } = getContractLayers(layerId, layerList);

    return {
        objectId,
        contractLayer,
        currentLayer,
        fields: nestedVal(contractLayer, ['fields']),
    };
};

const EditContractContrainer = (connect(mapStateToProps)(EditContract): any);

export default EditContractContrainer;
