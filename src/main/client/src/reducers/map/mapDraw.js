// @flow

import {
    SET_MAP_DRAW_TEXT,
    SET_HAS_GRAPHICS,
    TOGGLE_MEASUREMENTS,
} from '../../constants/actionTypes';

const initialState = {
    drawText: '',
    hasGraphics: false,
    showMeasurements: true,
};

type State = {
    drawText: string,
    hasGraphics: boolean,
    showMeasurements: boolean,
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
        case TOGGLE_MEASUREMENTS:
            return {
                ...state,
                showMeasurements: !state.showMeasurements,
            };
        default:
            return state;
    }
};
