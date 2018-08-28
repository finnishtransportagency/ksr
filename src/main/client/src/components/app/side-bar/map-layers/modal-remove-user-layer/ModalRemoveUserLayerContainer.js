// @flow
import { connect } from 'react-redux';
import ModalRemoveUserLayer from './ModalRemoveUserLayer';

import { removeUserLayerConfirmed } from '../../../../../reducers/map/actions';

const mapStateToProps = state => ({
    layerId: state.map.userLayer.layerToRemove,
});

const mapDispatchToProps = dispatch => ({
    removeUserLayerConfirmed: (layerId) => {
        dispatch(removeUserLayerConfirmed(layerId));
    },
});

const ModalRemoveUserLayerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalRemoveUserLayer);

export default ModalRemoveUserLayerContainer;
