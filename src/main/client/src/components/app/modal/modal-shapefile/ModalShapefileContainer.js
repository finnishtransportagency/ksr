// @flow
import { connect } from 'react-redux';
import ModalShapefile from './ModalShapefile';
import { setActiveModal } from '../../../../reducers/modal/actions';
import { addShapefile } from '../../../../reducers/map/actions';
import { addShapeFeaturesToTable } from '../../../../reducers/table/actions';

const mapStateToProps = (state: Object) => ({
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setActiveModal: (activeModal: any) => {
        dispatch(setActiveModal(activeModal));
    },
    addShapefile: (layer: any) => {
        dispatch(addShapefile(layer));
    },
    addShapeFeaturesToTable: (features: any) => {
        dispatch(addShapeFeaturesToTable(features));
    },
});

const ModalShapefileContainer = (connect(mapStateToProps, mapDispatchToProps)(ModalShapefile): any);

export default ModalShapefileContainer;
