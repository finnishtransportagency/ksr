// @flow
import {
    SET_MAP_TOOLS,
    SET_ACTIVE_TOOL,
    SET_ACTIVE_TOOL_MENU,
    SET_ACTIVE_FEATURE_MODE,
    SET_SNAPPING_FEATURE_SOURCES,
    ADD_FEATURE_NO_GEOMETRY,
} from '../../constants/actionTypes';

const initialState = {
    draw: {},
    sketchViewModel: {},
    active: '',
    activeToolMenu: '',
    activeFeatureMode: 'create',
    featureNoGeometry: undefined,
};

type Action = {
    type: string,
    draw: Object,
    sketchViewModel: Object,
    active: string,
    activeToolMenu: string,
    activeFeatureMode: string,
    featureSources: Object[],
    featureNoGeometry: Object,
};

export default (state: Object = initialState, action: Action): any => {
    switch (action.type) {
        case SET_MAP_TOOLS:
            return {
                ...state,
                draw: action.draw,
                sketchViewModel: action.sketchViewModel,
            };
        case SET_SNAPPING_FEATURE_SOURCES:
            if (state.sketchViewModel && state.sketchViewModel.snappingOptions) {
                state.sketchViewModel.snappingOptions.featureSources = action.featureSources;
            }
            return state;
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
        case ADD_FEATURE_NO_GEOMETRY:
            return {
                ...state,
                activeFeatureMode: action.featureNoGeometry ? 'edit' : 'create',
                featureNoGeometry: action.featureNoGeometry,
            };
        default:
            return state;
    }
};
