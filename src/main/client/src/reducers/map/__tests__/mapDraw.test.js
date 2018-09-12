import * as types from '../../../constants/actionTypes';
import reducer from '../mapDraw';

describe('mapDraw reducer', () => {
    it('should render initial state', () => {
        const initialState = {
            drawText: '',
            hasGraphics: false,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should set mapText', () => {
        const currentState = {
            drawText: 'current map text',
        };

        const action = {
            type: types.SET_MAP_DRAW_TEXT,
            drawText: 'Text should be this',
        };

        const expected = {
            drawText: 'Text should be this',
        };

        expect(reducer(currentState, action)).toEqual(expected);
    });
});
