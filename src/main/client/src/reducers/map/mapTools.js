// @flow
import { SET_MAP_TOOLS, SET_ACTIVE_TOOL } from '../../constants/actionTypes';

const initialState = {
    draw: {},
    sketchViewModel: {},
    active: '',
};

type Action = {
    type: string,
    draw: Object,
    sketchViewModel: Object,
    active: string,
};

export default (state: Object = initialState, action: Action) => {
    switch (action.type) {
        case SET_MAP_TOOLS:
            return {
                ...state,
                draw: action.draw,
                sketchViewModel: action.sketchViewModel,
            };
        case SET_ACTIVE_TOOL:
            return {
                ...state,
                active: action.active,
            };
        default:
            return state;
    }
};
