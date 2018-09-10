// @flow
import { connect } from 'react-redux';
import { setActiveTool, setActiveToolMenu } from '../../../../../reducers/map/actions';
import MapMeasure from './MapMeasure';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    isActive: state.map.mapTools.activeToolMenu === 'measureTools',
});

const mapDispatchToProps = dispatch => ({
    setActiveTool: (active) => {
        dispatch(setActiveTool(active));
    },
    setActiveToolMenu: (activeMenu) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
});

const MapMeasureContainer = connect(mapStateToProps, mapDispatchToProps)(MapMeasure);

export default MapMeasureContainer;
