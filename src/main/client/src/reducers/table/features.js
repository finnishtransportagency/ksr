// @flow
import { GET_FEATURES, GET_FEATURES_FULFILLED } from '../../constants/actionTypes';

type State = {
    features: Object,
    fetching: boolean,
};

type Action = {
    type: string,
    payload: Object,
    data: Array<any>,
    columns: Array<any>,
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
        default:
            return state;
    }
};
