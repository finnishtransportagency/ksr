// @flow
import { SET_ACTIVE_ADMIN_TOOL } from '../../constants/actionTypes';
import { findGeometryType } from '../../utils/type';

const initialState = {
    layerId: '',
    geometryType: '',
};

type State = {
    layerId: string,
    geometryType: string,
};

type Action = {
    layerId: string,
    type: string,
    layerList: Array<any>,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_ACTIVE_ADMIN_TOOL:
            return {
                layerId: state.layerId === action.layerId ? '' : action.layerId,
                geometryType: findGeometryType(action.layerId, action.layerList),
            };
        default:
            return state;
    }
};
