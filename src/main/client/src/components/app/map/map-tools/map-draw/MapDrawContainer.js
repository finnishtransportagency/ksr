// @flow
import { connect } from 'react-redux';
import { setActiveTool } from '../../../../../reducers/map/actions';
import MapDraw from './MapDraw';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
});

const mapDispatchToProps = dispatch => ({
    setActiveTool: (active) => {
        dispatch(setActiveTool(active));
    },
});

const MapDrawContainer = connect(mapStateToProps, mapDispatchToProps)(MapDraw);

export default MapDrawContainer;
