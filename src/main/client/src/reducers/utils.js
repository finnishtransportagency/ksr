// @flow
import store from '../store';
import { toggleTable } from './table/actions';
import * as types from '../constants/actionTypes';

/**
 * Close table view if nothing is shown in it.
 */
export const closeTableIfNothingToShow = () => {
    const { table } = store.getState();

    if (!table.features.editedLayers.length && table.toggleTable) {
        store.dispatch(toggleTable());
    }
};

/**
 * Checks whether layer legend should be toggled.
 * Won't toggle legend without manual open, if closed manually.
 *
 * @param dispatch Redux dispatch function.
 * @returns Whether should be toggled. Used for manual toggle check only.
 */
export const shouldToggleLayerLegend = (dispatch: Function): any => {
    const { layerList } = store.getState().map.layerGroups;
    const { manualClose, layerLegendActive } = store.getState().map.layerLegend;
    const { scale } = store.getState().map.mapView.view;

    const visibleThemeLayer = layerList
        .some(layer => layer.visible && layer.renderer && layer.minScale > scale);

    const shouldOpen = !layerLegendActive && visibleThemeLayer;
    const shouldClose = layerLegendActive && !visibleThemeLayer;

    if (!manualClose && (shouldOpen || shouldClose)) {
        dispatch({
            type: types.TOGGLE_LAYER_LEGEND,
            manualClose: false,
        });
    }

    return shouldOpen || shouldClose;
};
