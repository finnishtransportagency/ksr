// @flow
import { GET_MAP_CONFIG, GET_MAP_CONFIG_FULFILLED, SET_SCALE } from '../../constants/actionTypes';

type State = {
    mapCenter: Array<number>,
    mapScale: number,
    printServiceUrl: ?string,
    extractServiceUrl: ?string,
    fetching: boolean,
};

type Action = {
    mapCenter: Array<number>,
    mapScale: number,
    printServiceUrl: ?string,
    extractServiceUrl: ?string,
    type: string,
};

const initialState = {
    mapCenter: [],
    mapScale: 0,
    printServiceUrl: null,
    extractServiceUrl: null,
    fetching: true,
};

export default (state: State = initialState, action: Action): any => {
    switch (action.type) {
        case GET_MAP_CONFIG:
            return {
                ...state,
                fetching: true,
            };
        case GET_MAP_CONFIG_FULFILLED:
            return {
                mapCenter: action.mapCenter,
                mapScale: action.mapScale,
                printServiceUrl: action.printServiceUrl,
                extractServiceUrl: action.extractServiceUrl,
                fetching: false,
            };
        case SET_SCALE:
            // Avoid unnecessary rerenders by returning current state when nothing has changed
            if (state.mapScale === action.mapScale) {
                return state;
            }
            return {
                ...state,
                mapScale: action.mapScale,
            };
        default:
            return state;
    }
};
