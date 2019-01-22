// @flow
import {
    SET_MAP_TOOLS,
    SET_ACTIVE_TOOL,
    SET_ACTIVE_TOOL_MENU,
    SET_ACTIVE_FEATURE_MODE,
} from '../../constants/actionTypes';

const initialState = {
    draw: {},
    sketchViewModel: {},
    active: '',
    activeToolMenu: '',
    activeFeatureMode: 'create',
};

type Action = {
    type: string,
    draw: Object,
    sketchViewModel: Object,
    active: string,
    activeToolMenu: string,
    activeFeatureMode: string,
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
        case SET_ACTIVE_TOOL_MENU:
            return {
                ...state,
                activeToolMenu: state.active === '' ? action.activeToolMenu : state.activeToolMenu,
            };
        case SET_ACTIVE_FEATURE_MODE:
            return {
                ...state,
                activeFeatureMode: action.activeFeatureMode,
            };
        default:
            return state;
    }
};
