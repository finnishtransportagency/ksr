import { combineReducers } from 'redux';

import navigation from './navigation';
import map from './map';
import table from './table';
import search from './search';

export default combineReducers({
    navigation,
    map,
    table,
    search,
});
