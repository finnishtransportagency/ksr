import * as types from '../../../constants/actionTypes';
import reducer from '../workspace';

describe('workspace reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            workspaceList: [],
            fetching: false,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_WORKSPACE_LIST', () => {
        expect(reducer(undefined, {
            type: types.GET_WORKSPACE_LIST,
        })).toEqual({
            workspaceList: [],
            fetching: true,
        });
    });

    it('should handle GET_WORKSPACE_LIST_FULFILLED', () => {
        expect(reducer(undefined, {
            type: types.GET_WORKSPACE_LIST_FULFILLED,
            workspaceList: [{ '02051991': 'Test 1' }],
        })).toEqual({
            workspaceList: [{ '02051991': 'Test 1' }],
            fetching: false,
        });
    });
});
