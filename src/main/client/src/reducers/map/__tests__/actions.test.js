import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe.skip('actions', () => {
    it('should create an action to GET active layer tab', () => {
        const expectedAction = { type: types.GET_ACTIVE_LAYER_TAB };
        expect(actions.getActiveLayerTab()).toEqual(expectedAction);
    });

    it('should create an action to SET active layer tab', () => {
        const expectedAction = { type: types.SET_ACTIVE_LAYER_TAB };
        expect(actions.setActiveLayerTab()).toEqual(expectedAction);
    });

    it('should return action for setMapDrawText', () => {
        const expectedAction = {
            type: types.SET_MAP_DRAW_TEXT,
            drawText: 'Should return this text',
        };

        expect(actions.setMapDrawText('Should return this text')).toEqual(expectedAction);
    });
});
