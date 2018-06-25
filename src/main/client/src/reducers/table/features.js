// @flow
import { GET_FEATURES, GET_FEATURES_FULFILLED, SET_FEATURES } from '../../constants/actionTypes';

type State = {
    features: Object,
    fetching: boolean,
    columns: Array<Object>,
};

type Action = {
    type: string,
    payload: Object,
    data: Array<any>,
    columns: Array<Object>,
};

const initialState = {
    features: {},
    fetching: true,
    data: [],
    columns: [],
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case GET_FEATURES:
            return {
                ...state,
                fetching: true,
            };
        case GET_FEATURES_FULFILLED:
            return {
                ...state,
                features: action.payload,
                data: action.data,
                columns: action.columns,
                fetching: false,
            };
        case SET_FEATURES:
            return {
                ...state,
                columns: action.payload,
            };
        default:
            return state;
    }
};
