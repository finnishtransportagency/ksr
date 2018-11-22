// @flow
import { ADD_EDIT, SET_EDITS } from '../../constants/actionTypes';

type Action = {
    count: ?number,
    type: string,
};

export default (state: number = 0, action: Action) => {
    switch (action.type) {
        case ADD_EDIT:
            return state + 1;
        case SET_EDITS:
            return action.count;
        default:
            return state;
    }
};
