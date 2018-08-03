// @flow
import * as types from '../../constants/actionTypes';

export const setActiveAdminTool = (layerId: string) => ({
    type: types.SET_ACTIVE_ADMIN_TOOL,
    layerId,
});

export const deleteSelectedData = (selectedData: Array<Object>, deleteComment: string) => {
    // TODO: Change data to 'removed' in arcgis server
    // TODO: Add comment to deletion history?
    console.log(selectedData);
    console.log(deleteComment);
    return {
        type: types.DELETE_SELECTED_DATA,
        selectedData,
    };
};
