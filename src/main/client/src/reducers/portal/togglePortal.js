// @flow
import { TOGGLE_PORTAL } from '../../constants/actionTypes';

const initialState = false;

type State = boolean;

type Action = {
    type: string,
};

export default (state: State = initialState, action: Action): boolean | State => {
    switch (action.type) {
        case TOGGLE_PORTAL:
            return !state;
        default:
            return state;
    }
};
