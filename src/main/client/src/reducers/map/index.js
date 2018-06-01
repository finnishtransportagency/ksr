import { combineReducers } from 'redux';
import wmsLayers from './wmsLayers';
import wmtsLayers from './wmtsLayers';
import layerGroups from './layerGroups';

export default combineReducers({
    wmsLayers,
    wmtsLayers,
    layerGroups,
});
