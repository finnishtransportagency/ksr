// @flow
import * as types from '../../constants/actionTypes';

export const setActiveAdminTool = (layerId: string) => ({
    type: types.SET_ACTIVE_ADMIN_TOOL,
    layerId,
});

export const deleteSelectedData = (selectedData: Array<Object>) => {
    // TODO: remove data from arcgis server
    console.log(selectedData);
    return {
        type: types.DELETE_SELECTED_DATA,
        selectedData,
    };
};
