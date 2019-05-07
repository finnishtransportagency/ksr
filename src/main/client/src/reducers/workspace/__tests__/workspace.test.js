import * as types from '../../../constants/actionTypes';
import reducer from '../workspace';

describe('workspace reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            workspaceList: [],
            fetching: false,
            loadingWorkspace: false,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_WORKSPACE_LIST', () => {
        expect(reducer(undefined, {
            type: types.GET_WORKSPACE_LIST,
        })).toEqual({
            workspaceList: [],
            fetching: true,
            loadingWorkspace: false,
        });
    });

    it('should handle GET_WORKSPACE_LIST_FULFILLED', () => {
        expect(reducer(undefined, {
            type: types.GET_WORKSPACE_LIST_FULFILLED,
            workspaceList: [{ '02051991': 'Test 1' }],
        })).toEqual({
            workspaceList: [{ '02051991': 'Test 1' }],
            fetching: false,
            loadingWorkspace: false,
        });
    });

    it('should handle SET_WORKSPACE', () => {
        expect(reducer(undefined, {
            type: types.SET_WORKSPACE,
        })).toEqual({
            workspaceList: [],
            fetching: false,
            loadingWorkspace: true,
        });
    });

    it('should handle SET_WORKSPACE_REJECTED', () => {
        expect(reducer(undefined, {
            type: types.SET_WORKSPACE_REJECTED,
        })).toEqual({
            workspaceList: [],
            fetching: false,
            loadingWorkspace: false,
        });
    });

    it('should handle SET_WORKSPACE_FULFILLED', () => {
        expect(reducer(undefined, {
            type: types.SET_WORKSPACE_FULFILLED,
        })).toEqual({
            workspaceList: [],
            fetching: false,
            loadingWorkspace: false,
        });
    });
});
