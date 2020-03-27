// @flow
import { TOGGLE_INDEX_MAP } from '../../constants/actionTypes';

type State = {
    indexMapActive: boolean,
};

type Action = {
    type: string,
};

const initialState = {
    indexMapActive: false,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case TOGGLE_INDEX_MAP:
            return {
                ...state,
                indexMapActive: !state.indexMapActive,
            };
        default:
            return state;
    }
};
