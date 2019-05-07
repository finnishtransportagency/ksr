// @flow
import { SET_CONTRACT_LIST_INFO, REMOVE_CONTRACT_LIST_INFO } from '../../constants/actionTypes';

const initialState = {
    layerId: null,
    objectId: null,
};

type Action = {
    type: string,
    layerId: number,
    objectId: number,
};

export default (state: Object = initialState, action: Action) => {
    switch (action.type) {
        case SET_CONTRACT_LIST_INFO:
            return {
                layerId: action.layerId,
                objectId: action.objectId,
            };
        case REMOVE_CONTRACT_LIST_INFO:
            return initialState;
        default:
            return state;
    }
};
