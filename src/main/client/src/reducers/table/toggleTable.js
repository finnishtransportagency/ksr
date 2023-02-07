// @flow
import { CLEAR_TABLE_DATA, TOGGLE_TABLE } from '../../constants/actionTypes';

const initialState = false;

type State = boolean;

type Action = {
    type: string,
};

export default (state: State = initialState, action: Action): any => {
    switch (action.type) {
        case TOGGLE_TABLE:
            return !state;
        case CLEAR_TABLE_DATA:
            return false;
        default:
            return state;
    }
};
