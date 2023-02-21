// @flow
import { SET_ACTIVE_SEARCH, SET_PROPERTY_INFO } from '../../constants/actionTypes';

type State = string;

type Action = {
    type: string,
    activeSearch: string,
};

const initialState = 'layer';

export default (state: State = initialState, action: Action): string | State => {
    switch (action.type) {
        case SET_ACTIVE_SEARCH:
            return action.activeSearch;
        case SET_PROPERTY_INFO:
            return 'property';
        default:
            return state;
    }
};
