import { combineReducers } from 'redux';
import toggleTable from './toggleTable';
import toggleFilter from './toggleFilter';
import features from './features';
import buttonAmount from './buttonAmount';

export default combineReducers({
    toggleTable,
    toggleFilter,
    features,
    buttonAmount,
});
