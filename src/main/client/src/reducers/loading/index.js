// @flow
import { SET_LOADING, REMOVE_LOADING } from '../../constants/actionTypes';

type Action = {
    type: string,
};

const initialState = false;

export default (state: boolean = initialState, action: Action) => {
    switch (action.type) {
        case SET_LOADING:
            return true;
        case REMOVE_LOADING:
            return false;
        default:
            return state;
    }
};
