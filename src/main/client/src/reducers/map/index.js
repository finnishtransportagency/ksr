import { combineReducers } from 'redux';
import wmsLayers from './wmsLayers';
import wmtsLayers from './wmtsLayers';

export default combineReducers({
    wmsLayers,
    wmtsLayers,
});
