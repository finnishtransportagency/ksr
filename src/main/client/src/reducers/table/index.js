import { combineReducers } from 'redux';
import toggleTable from './toggleTable';
import toggleFilter from './toggleFilter';
import features from './features';

export default combineReducers({
    toggleTable,
    toggleFilter,
    features,
});
