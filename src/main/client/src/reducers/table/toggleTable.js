// @flow
import { TOGGLE_TABLE } from '../../constants/actionTypes';

const initialState = false;

type State = boolean;

type Action = {
    type: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case TOGGLE_TABLE:
            return !state;
        default:
            return state;
    }
};
