// @flow
import { SET_MAP_VIEW } from '../../constants/actionTypes';

const initialState = {};

type Action = {
    type: string,
    view: any,
};

export default (state: Object = initialState, action: Action) => {
    switch (action.type) {
        case SET_MAP_VIEW:
            return action.view;
        default:
            return state;
    }
};
