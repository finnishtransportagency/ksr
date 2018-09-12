// @flow

import { SET_MAP_DRAW_TEXT, SET_HAS_GRAPHICS } from '../../constants/actionTypes';

const initialState = {
    drawText: '',
    hasGraphics: false,
};

type State = {
    drawText: string,
    hasGraphics: boolean,
}

type Action = {
    type: string,
    drawText: string,
    hasGraphics: boolean,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_MAP_DRAW_TEXT:
            return {
                ...state,
                drawText: action.drawText,
            };
        case SET_HAS_GRAPHICS:
            return {
                ...state,
                hasGraphics: action.hasGraphics,
            };
        default:
            return state;
    }
};
