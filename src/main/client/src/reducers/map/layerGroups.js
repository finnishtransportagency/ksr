// @flow
import { getLayerGroups } from '../../api/map-layers/layerGroups';
import { GET_LAYER_GROUPS } from '../../constants/actionTypes';

const initialState = getLayerGroups();

type SubLayers = {
    name: string,
};

type WmsLayer = {
    server: string,
    url: string,
    copyright: string,
    sublayers: Array<SubLayers>
}

type State = Array<WmsLayer>;

type Action = {
    selectedNav: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case GET_LAYER_GROUPS:
            return state;
        default:
            return state;
    }
};
