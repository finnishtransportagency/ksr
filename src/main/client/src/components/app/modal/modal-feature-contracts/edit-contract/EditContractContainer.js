// @flow
import { connect } from 'react-redux';
import EditContract from './EditContract';

const mapStateToProps = (state, ownProps) => {
    const { objectId } = state.contract.contractList;

    return {
        objectId,
        contractLayer: ownProps.contractLayer,
        currentLayer: ownProps.currentLayer,
        fields: ownProps.fields,
    };
};

const EditContractContrainer = (connect(mapStateToProps)(EditContract): any);

export default EditContractContrainer;
