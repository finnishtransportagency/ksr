import { fetchActiveLayers } from '../../../api/map-layers/activeLayers';
import { fetchLayerGroups } from '../../../api/map-layers/layerGroups';
import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to GET active layer tab', () => {
        const expectedAction = { type: types.GET_ACTIVE_LAYER_TAB };
        expect(actions.getActiveLayerTab()).toEqual(expectedAction);
    });

    it('should create an action to SET active layer tab', () => {
        const expectedAction = { type: types.SET_ACTIVE_LAYER_TAB };
        expect(actions.setActiveLayerTab()).toEqual(expectedAction);
    });
});
