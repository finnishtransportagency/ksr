import { combineReducers } from 'redux';
import layerGroups from './layerGroups';
import activeLayerTab from './activeLayerTab';

export default combineReducers({
    layerGroups,
    activeLayerTab,
});
