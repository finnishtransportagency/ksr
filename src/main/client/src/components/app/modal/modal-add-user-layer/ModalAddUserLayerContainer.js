// @flow
import { connect } from 'react-redux';
import { addUserLayer } from '../../../../reducers/map/actions';
import ModalAddUserLayer from './ModalAddUserLayer';

const mapDispatchToProps = dispatch => ({
    addUserLayer: (layerValues) => {
        dispatch(addUserLayer(layerValues));
    },
});

const ModalAddUserLayerContainer = connect(null, mapDispatchToProps)(ModalAddUserLayer);

export default ModalAddUserLayerContainer;
