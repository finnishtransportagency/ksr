import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to SET active admin tool', () => {
        const expectedAction = {
            type: types.SET_ACTIVE_ADMIN_TOOL,
            layerId: '1',
            layerList: [
                { id: '1' },
                { id: '2' },
                { id: '3' },
            ],
        };

        const layerId = '1';
        const layerList = [
            { id: '1' },
            { id: '2' },
            { id: '3' },
        ];

        expect(actions.setActiveAdminTool(layerId, layerList)).toEqual(expectedAction);
    });
});
