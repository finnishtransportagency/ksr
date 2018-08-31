import { combineReducers } from 'redux';
import layerGroups from './layerGroups';
import activeLayerTab from './activeLayerTab';
import mapConfig from './mapConfig';
import mapView from './mapView';
import mapTools from './mapTools';
import userLayer from './userLayer';

export default combineReducers({
    layerGroups,
    activeLayerTab,
    mapConfig,
    mapView,
    mapTools,
    userLayer,
});
