// @flow
import * as types from '../../constants/actionTypes';

export const setContractListInfo = (
    layerId: number,
    objectId: number,
) => ({
    type: types.SET_CONTRACT_LIST_INFO,
    layerId,
    objectId,
});

export const removeContractListInfo = () => ({
    type: types.REMOVE_CONTRACT_LIST_INFO,
});
