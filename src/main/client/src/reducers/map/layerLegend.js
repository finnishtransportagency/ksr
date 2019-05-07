// @flow

import { TOGGLE_LAYER_LEGEND } from '../../constants/actionTypes';

type State = {
    layerLegendActive: boolean,
};

type Action = {
    type: string,
};

const initialState = { layerLegendActive: false };

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case TOGGLE_LAYER_LEGEND:
            return { layerLegendActive: !state.layerLegendActive };
        default:
            return state;
    }
};
