// @flow
import { TOGGLE_FILTER } from '../../constants/actionTypes';

const initialState = false;

type State = boolean;

type Action = {
    type: string,
};

export default (state: State = initialState, action: Action): any => {
    switch (action.type) {
        case TOGGLE_FILTER:
            return !state;
        default:
            return state;
    }
};
