// @flow
import { SET_BUTTON_AMOUNT } from '../../constants/actionTypes';

const initialState = 7;

type State = number;

type Action = {
    type: string,
    buttonAmount: ?number,
};

export default (state: State = initialState, action: Action) => {
    if (action.type === SET_BUTTON_AMOUNT) {
        return action.buttonAmount !== null
            ? action.buttonAmount
            : initialState;
    }
    return state;
};
