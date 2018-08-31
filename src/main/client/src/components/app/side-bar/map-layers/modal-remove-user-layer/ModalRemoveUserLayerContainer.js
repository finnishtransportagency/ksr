// @flow
import { connect } from 'react-redux';
import ModalRemoveUserLayer from './ModalRemoveUserLayer';

import { removeUserLayerConfirmed } from '../../../../../reducers/map/actions';

const mapStateToProps = state => ({
    layerId: state.map.userLayer.layerToRemove,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    removeUserLayerConfirmed: (layerId, layerList) => {
        dispatch(removeUserLayerConfirmed(layerId, layerList));
    },
});

const ModalRemoveUserLayerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalRemoveUserLayer);

export default ModalRemoveUserLayerContainer;
