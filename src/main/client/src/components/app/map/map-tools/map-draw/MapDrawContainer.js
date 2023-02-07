// @flow
import { connect } from 'react-redux';
import {
    setActiveTool,
    setMapDrawText,
    setActiveToolMenu,
    setHasGraphics,
    toggleMeasurements,
} from '../../../../../reducers/map/actions';
import { setActiveModal } from '../../../../../reducers/modal/actions';
import MapDraw from './MapDraw';

const mapStateToProps = (state: Object) => ({
    view: state.map.mapView.view,
    active: state.map.mapTools.active,
    draw: state.map.mapTools.draw,
    sketchViewModel: state.map.mapTools.sketchViewModel,
    drawText: state.map.mapDraw.drawText,
    hasGraphics: state.map.mapDraw.hasGraphics,
    drawTextModalActive: state.modal.activeModal === 'drawText',
    isActive: state.map.mapTools.activeToolMenu === 'drawTools',
    showMeasurements: state.map.mapDraw.showMeasurements,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setActiveTool: (active: string) => {
        if (active === 'drawText') {
            dispatch(setActiveModal('drawText'));
        }
        dispatch(setMapDrawText(''));
        dispatch(setActiveTool(active));
    },
    setActiveToolMenu: (activeMenu: any) => {
        dispatch(setActiveToolMenu(activeMenu));
    },
    setHasGraphics: (hasGraphics: any) => {
        dispatch(setHasGraphics(hasGraphics));
    },
    toggleMeasurements: () => {
        dispatch(toggleMeasurements());
    },
});

const MapDrawContainer = (connect(mapStateToProps, mapDispatchToProps)(MapDraw): any);

export default MapDrawContainer;
