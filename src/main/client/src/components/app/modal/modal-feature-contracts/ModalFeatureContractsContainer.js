// @flow
import { connect } from 'react-redux';
import { removeContractListInfo } from '../../../../reducers/contract/actions';
import ModalFeatureContracts from './ModalFeatureContracts';

const mapStateToProps = (state) => {
    const { layerId } = state.contract.contractList;
    const currentLayer = layerId && state.map.layerGroups.layerList
        .find(layer => layer.id === layerId.replace('.s', ''));

    return {
        objectId: state.contract.contractList.objectId,
        currentLayer,
    };
};

const mapDispatchToProps = dispatch => ({
    removeContractListInfo: () => {
        dispatch(removeContractListInfo());
    },
});

const ModalFeatureContractsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalFeatureContracts);

export default ModalFeatureContractsContainer;
