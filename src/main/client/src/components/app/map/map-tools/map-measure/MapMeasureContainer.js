// @flow
import { connect } from 'react-redux';
import { setActiveTool } from '../../../../../reducers/map/actions';
import MapMeasure from './MapMeasure';

const mapStateToProps = state => ({
    view: state.map.mapView,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
});

const mapDispatchToProps = dispatch => ({
    setActiveTool: (active) => {
        dispatch(setActiveTool(active));
    },
});

const MapMeasureContainer = connect(mapStateToProps, mapDispatchToProps)(MapMeasure);

export default MapMeasureContainer;
