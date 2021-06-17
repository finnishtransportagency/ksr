import { combineReducers } from 'redux';
import toggleTable from './toggleTable';
import toggleFilter from './toggleFilter';
import features from './features';
import buttonAmount from './buttonAmount';
import activePage from './activePage';

export default combineReducers({
    toggleTable,
    toggleFilter,
    features,
    buttonAmount,
    activePage,
});
