import { combineReducers } from 'redux';
import layerGroups from './layerGroups';
import activeLayerTab from './activeLayerTab';
import mapConfig from './mapConfig';
import mapView from './mapView';
import mapTools from './mapTools';
import userLayer from './userLayer';
import mapDraw from './mapDraw';
import layerLegend from './layerLegend';
import indexMap from './indexMap';

export default combineReducers({
    layerGroups,
    activeLayerTab,
    mapConfig,
    mapView,
    mapTools,
    userLayer,
    mapDraw,
    layerLegend,
    indexMap,
});
