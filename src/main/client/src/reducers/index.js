import { combineReducers } from 'redux';

import navigation from './navigation';
import map from './map';
import table from './table';
import search from './search';
import modal from './modal';
import adminTool from './adminTool';
import confirmModal from './confirmModal';

export default combineReducers({
    navigation,
    map,
    table,
    search,
    modal,
    adminTool,
    confirmModal,
});
