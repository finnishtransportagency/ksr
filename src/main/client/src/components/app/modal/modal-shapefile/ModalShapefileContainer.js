// @flow
import { connect } from 'react-redux';
import ModalShapefile from './ModalShapefile';
import { setActiveModal } from '../../../../reducers/modal/actions';
import { addShapefile } from '../../../../reducers/map/actions';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    setActiveModal: (activeModal) => {
        dispatch(setActiveModal(activeModal));
    },
    addShapefile: (layer) => {
        dispatch(addShapefile(layer));
    },
});

const ModalShapefileContainer = (connect(mapStateToProps, mapDispatchToProps)(ModalShapefile): any);

export default ModalShapefileContainer;
