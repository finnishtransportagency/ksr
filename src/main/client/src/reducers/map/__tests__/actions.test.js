import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to get WMS layers', () => {
        const expectedAction = { type: types.GET_WMS_LAYERS };
        expect(actions.getWmsLayers()).toEqual(expectedAction);
    });

    it('should create an action to set WMS layers', () => {
        const expectedAction = { type: types.SET_WMS_LAYERS };
        expect(actions.setWmsLayers()).toEqual(expectedAction);
    });

    it('should create an action to get WMTS layers', () => {
        const expectedAction = { type: types.GET_WMTS_LAYERS };
        expect(actions.getWmtsLayers()).toEqual(expectedAction);
    });

    it('should create an action to set WMTS layers', () => {
        const expectedAction = { type: types.SET_WMTS_LAYERS };
        expect(actions.setWmtsLayers()).toEqual(expectedAction);
    });
});
