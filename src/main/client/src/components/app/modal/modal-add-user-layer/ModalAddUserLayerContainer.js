// @flow
import { connect } from 'react-redux';
import { addUserLayer } from '../../../../reducers/map/actions';
import ModalAddUserLayer from './ModalAddUserLayer';

const mapDispatchToProps = (dispatch: Function) => ({
    addUserLayer: (layerValues: any) => {
        dispatch(addUserLayer(layerValues));
    },
});

const ModalAddUserLayerContainer = (connect(null, mapDispatchToProps)(ModalAddUserLayer): any);

export default ModalAddUserLayerContainer;
