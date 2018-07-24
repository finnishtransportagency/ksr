// @flow
import { connect } from 'react-redux';
import { setActiveTool } from '../../../../../reducers/map/actions';
import { selectFeatures, deSelectSelected } from '../../../../../reducers/table/actions';
import SketchTool from './SketchTool';

const mapStateToProps = state => ({
    view: state.map.mapView,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    data: state.table.features.layers
        .reduce((a, b) => a.concat(b.data.filter(d => d._selected)), []),
});

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    deSelectSelected: () => {
        dispatch(deSelectSelected());
    },
    setActiveTool: (active) => {
        dispatch(setActiveTool(active));
    },
});

const SketchToolContainer = connect(mapStateToProps, mapDispatchToProps)(SketchTool);

export default SketchToolContainer;
