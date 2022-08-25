// @flow

import { TOGGLE_LAYER_LEGEND } from '../../constants/actionTypes';

type State = {
    layerLegendActive: boolean,
    manualClose: boolean,
};

type Action = {
    type: string,
};

const initialState = {
    layerLegendActive: false,
    manualClose: false,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case TOGGLE_LAYER_LEGEND:
            return {
                layerLegendActive: !state.layerLegendActive,
                manualClose: action.manualClose,
            };
        default:
            return state;
    }
};
