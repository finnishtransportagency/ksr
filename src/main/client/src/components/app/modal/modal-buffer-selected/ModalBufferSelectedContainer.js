// @flow
import { connect } from 'react-redux';
import ModalBufferSelected from './ModalBufferSelected';
import { setSingleLayerGeometry } from '../../../../reducers/table/actions';

const mapStateToProps = (state) => {
    const selectedGeometryData = [];
    if (state.table.features.singleLayerGeometry.type === undefined) {
        state.table.features.layers.forEach((l) => {
            l.data.forEach(d => d._selected && d.geometry &&
                selectedGeometryData.push(d.geometry));
        });
    } else {
        selectedGeometryData.push(state.table.features.singleLayerGeometry);
    }

    return {
        selectedGeometryData,
        view: state.map.mapView.view,
    };
};
const mapDispatchToProps = dispatch => ({
    setSingleLayerGeometry: (geometry) => {
        dispatch(setSingleLayerGeometry(geometry));
    },
});

const ModalBufferSelectedContainer = connect(mapStateToProps, mapDispatchToProps)(ModalBufferSelected);

export default ModalBufferSelectedContainer;
