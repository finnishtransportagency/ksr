// @flow
import * as types from '../../constants/actionTypes';

export const setContractListInfo = (
    layerId: number,
    objectId: number,
    contractIdField: string,
    contractDescriptionField: string,
) => ({
    type: types.SET_CONTRACT_LIST_INFO,
    layerId,
    objectId,
    contractIdField,
    contractDescriptionField,
});

export const removeContractListInfo = () => ({
    type: types.REMOVE_CONTRACT_LIST_INFO,
});
