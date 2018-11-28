import { combineReducers } from 'redux';

import navigation from './navigation';
import map from './map';
import table from './table';
import search from './search';
import modal from './modal';
import adminTool from './adminTool';
import workspace from './workspace';
import confirmModal from './confirmModal';
import contract from './contract';
import user from './user';
import offline from './offline';

export default combineReducers({
    navigation,
    map,
    table,
    search,
    modal,
    adminTool,
    workspace,
    confirmModal,
    contract,
    user,
    offline,
});
