// @flow
import {
    SET_MAP_TOOLS,
    SET_ACTIVE_TOOL,
    SET_EDIT_MODE,
    SET_ACTIVE_TOOL_MENU,
} from '../../constants/actionTypes';

const initialState = {
    draw: {},
    sketchViewModel: {},
    active: '',
    activeToolMenu: '',
    editMode: '',
};

type Action = {
    type: string,
    draw: Object,
    sketchViewModel: Object,
    active: string,
    activeToolMenu: string,
    editMode: string,
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
        case SET_EDIT_MODE:
            return {
                ...state,
                editMode: action.editMode,
            };
        case SET_ACTIVE_TOOL_MENU:
            return {
                ...state,
                activeToolMenu: state.active === '' ? action.activeToolMenu : state.activeToolMenu,
            };
        default:
            return state;
    }
};
