import { combineReducers } from 'redux';
import layerGroups from './layerGroups';
import activeLayerTab from './activeLayerTab';
import activeLayers from './activeLayers';

export default combineReducers({
    layerGroups,
    activeLayerTab,
    activeLayers,
});
