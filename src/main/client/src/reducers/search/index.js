import { combineReducers } from 'redux';
import searchState from './searchState';
import propertyInfo from './propertyInfo';
import activeSearch from './activeSearch';

export default combineReducers({
    searchState,
    propertyInfo,
    activeSearch,
});
