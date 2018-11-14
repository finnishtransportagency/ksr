// @flow
import { connect } from 'react-redux';
import { removeContractListInfo } from '../../../../reducers/contract/actions';
import ModalFeatureContracts from './ModalFeatureContracts';

const mapDispatchToProps = dispatch => ({
    removeContractListInfo: () => {
        dispatch(removeContractListInfo());
    },
});

const ModalFeatureContractsContainer = connect(null, mapDispatchToProps)(ModalFeatureContracts);

export default ModalFeatureContractsContainer;
