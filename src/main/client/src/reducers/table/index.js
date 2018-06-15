import { combineReducers } from 'redux';
import toggleTable from './toggleTable';
import features from './features';

export default combineReducers({
    toggleTable,
    features,
});
