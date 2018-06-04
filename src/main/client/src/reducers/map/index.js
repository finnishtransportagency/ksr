import { combineReducers } from 'redux';
import wmsLayers from './wmsLayers';
import wmtsLayers from './wmtsLayers';
import layerGroups from './layerGroups';
import activeLayerTab from './activeLayerTab';
import activeLayers from './activeLayers';

export default combineReducers({
    wmsLayers,
    wmtsLayers,
    layerGroups,
    activeLayerTab,
    activeLayers,
});
