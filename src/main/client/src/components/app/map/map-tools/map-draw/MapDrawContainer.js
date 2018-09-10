// @flow
import { connect } from 'react-redux';
import {
    setActiveTool,
    setMapDrawText,
    setActiveToolMenu,
} from '../../../../../reducers/map/actions';
import { setActiveModal } from '../../../../../reducers/modal/actions';
import MapDraw from './MapDraw';

const mapStateToProps = state => ({
    view: state.map.mapView.view,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    drawText: state.map.mapDraw.drawText,
    drawTextModalActive: state.modal.activeModal === 'drawText',
    isActive: state.map.mapTools.activeToolMenu === 'drawTools',
});

const mapDispatchToProps = dispatch => ({
    setActiveTool: (active) => {
        if (active === 'drawText') {
            dispatch(setActiveModal('drawText'));
        }
        dispatch(setMapDrawText(''));
        dispatch(setActiveTool(active));
    },
    setActiveToolMenu: (activeMenu) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
});

const MapDrawContainer = connect(mapStateToProps, mapDispatchToProps)(MapDraw);

export default MapDrawContainer;
