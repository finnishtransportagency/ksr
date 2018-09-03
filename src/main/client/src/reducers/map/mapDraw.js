// @flow

import { SET_MAP_DRAW_TEXT } from '../../constants/actionTypes';

const initialState = {
    drawText: '',
};

type State = {
    drawText: string,
}

type Action = {
    type: string,
    drawText: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_MAP_DRAW_TEXT:
            return {
                ...state,
                drawText: action.drawText,
            };
        default:
            return state;
    }
};
