// @flow
import { SET_ACTIVE_PAGE, CLOSE_LAYER } from '../../constants/actionTypes';

const initialState = {};

type Action = {
    type: string,
    page: Object,
    layerId: any,
};

export default (state: any = initialState, action: Action): any => {
    switch (action.type) {
        case SET_ACTIVE_PAGE:
            return {
                ...state,
                [action.page.layerId]: action.page.page,
            };
        case CLOSE_LAYER:
            delete state[action.layerId];
            return {
                ...state,
            };
        default:
            return state;
    }
};
