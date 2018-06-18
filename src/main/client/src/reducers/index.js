import { combineReducers } from 'redux';

import navigation from './navigation';
import map from './map';
import table from './table';

export default combineReducers({
    navigation,
    map,
    table,
});
