// @flow
import { SET_CONTRACT_LIST_INFO, REMOVE_CONTRACT_LIST_INFO } from '../../constants/actionTypes';

const initialState = {
    layerId: null,
    objectId: null,
    contractIdField: '',
    contractDescriptionField: '',
};

type Action = {
    type: string,
    layerId: number,
    objectId: number,
    contractIdField: string,
    contractDescriptionField: string,
};

export default (state: Object = initialState, action: Action) => {
    switch (action.type) {
        case SET_CONTRACT_LIST_INFO:
            return {
                layerId: action.layerId,
                objectId: action.objectId,
                contractIdField: action.contractIdField,
                contractDescriptionField: action.contractDescriptionField,
            };
        case REMOVE_CONTRACT_LIST_INFO:
            return initialState;
        default:
            return state;
    }
};
