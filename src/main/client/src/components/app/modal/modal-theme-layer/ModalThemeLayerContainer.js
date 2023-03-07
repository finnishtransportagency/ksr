// @flow
import { connect } from 'react-redux';
import { setLayerList, toggleLayerLegend } from '../../../../reducers/map/actions';
import ModalThemeLayer from './ModalThemeLayer';

const mapStateToProps = (state: Object) => ({
    view: state.map.mapView.view,
    layerId: state.modal.activeModal.data,
    layerLegendActive: state.map.layerLegend.layerLegendActive,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = (dispatch: Function) => ({
    toggleLayerLegend: () => {
        dispatch(toggleLayerLegend());
    },
    setLayerList: (layerList: any) => {
        dispatch(setLayerList(layerList));
    },
});

const ModalThemeLayerContainer = (connect(mapStateToProps, mapDispatchToProps)(ModalThemeLayer): any);

export default ModalThemeLayerContainer;
