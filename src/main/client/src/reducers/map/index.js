import { combineReducers } from 'redux';
import layerGroups from './layerGroups';
import activeLayerTab from './activeLayerTab';
import mapConfig from './mapConfig';

export default combineReducers({
    layerGroups,
    activeLayerTab,
    mapConfig,
});
