// @flow
import { connect } from 'react-redux';
import ContractList from './ContractList';

const mapStateToProps = state => ({
    layerId: state.contract.contractList.layerId,
    objectId: state.contract.contractList.objectId,
    contractIdField: state.contract.contractList.contractIdField,
    contractDescriptionField: state.contract.contractList.contractDescriptionField,
});

const ContractListContainer = connect(mapStateToProps, null)(ContractList);

export default ContractListContainer;
