// @flow
import * as types from '../../constants/actionTypes';

export const setActiveAdminTool = (layerId: string, layerList: Array<any>) => ({
    type: types.SET_ACTIVE_ADMIN_TOOL,
    layerId,
    layerList,
});
