// @flow
import moment from 'moment';
import { toast } from 'react-toastify';
import * as types from '../../constants/actionTypes';
import strings from '../../translations/fi';
import { getWorkspaceFeatures, queryWorkspaceFeatures } from '../../utils/workspace/loadWorkspace';
import { addNonSpatialContentToTable, searchWorkspaceFeatures } from '../table/actions';
import { parseData } from '../../utils/parseFeatureData';
import { getSingleLayerFields } from '../../utils/map';

/**
 * Handles workspace fetches and workspace list update.
 *
 * @param {Function} workspaceFetch Workspace fetch
 * (fetchDeleteWorkspace | fetchSaveWorkspace | fetchGetWorkspaceList).
 * @param {Object | string} [fetchParam] Parameters passed to fetch.
 * Delete needs workspace name as string only.
 * @param {string} [type] Type of workspace action (create | delete | replace).
 */
export const updateWorkspaces = (
    workspaceFetch: Function,
    fetchParam?: any,
    type?: string,
) => (dispatch: Function) => {
    dispatch({ type: types.GET_WORKSPACE_LIST });
    workspaceFetch(fetchParam)
        .then((r) => {
            if (!r.error) {
                const workspaceList = r.map(w => ({
                    ...w,
                    updated: moment(w.updateTime).format('DD.MM.YYYY HH:mm'),
                }));
                dispatch({
                    type: types.GET_WORKSPACE_LIST_FULFILLED,
                    workspaceList,
                });

                if (fetchParam && type) {
                    switch (type) {
                        case 'create':
                            toast.success(`${strings.workspace.workspaceCreated} [${fetchParam.name}]`);
                            break;
                        case 'delete':
                            toast.success(`${strings.workspace.confirmDelete.workspaceDeleted} [${fetchParam}]`);
                            break;
                        case 'replace':
                            toast.success(`${strings.workspace.confirmReplace.workspaceReplaced} [${fetchParam.name}]`);
                            break;
                        default:
                            break;
                    }
                }
            } else {
                dispatch({
                    type: types.GET_WORKSPACE_LIST_REJECTED,
                });

                if (fetchParam && type) {
                    switch (type) {
                        case 'create':
                            toast.error(strings.workspace.workspaceCreatedError);
                            break;
                        case 'delete':
                            toast.error(strings.workspace.confirmDelete.workspaceDeletedError);
                            break;
                        case 'replace':
                            toast.error(strings.workspace.confirmReplace.workspaceReplacedError);
                            break;
                        default:
                            break;
                    }
                }

                throw new Error('GET_WORKSPACE_LIST_REJECTED -error');
            }
        })
        .catch(err => console.log(err));
};

/**
 * Sets all the spatial-, nonSpatial- and search features from loaded workspace.
 *
 * @param {Object} workspace Workspace to be loaded.
 * @param {Object[]} layers List of layers to be activated for the workspace.
 */
export const setWorkspaceFeatures = (
    workspace: Object,
    layers: Object[],
) => async (dispatch: Function, getState: Function) => {
    const spatialWorkspace = workspace.layers
        .filter(wl => layers.find(l => l.id === wl.layerId && l.type !== 'agfl'));
    const workspaceFeatures = getWorkspaceFeatures(spatialWorkspace);
    const layerFeatures = await queryWorkspaceFeatures(
        workspaceFeatures,
        dispatch(getState).map.mapView.view,
    );

    dispatch({
        type: types.SELECT_FEATURES,
        layers: parseData(layerFeatures, true),
    });

    dispatch(searchWorkspaceFeatures(workspace, dispatch(getState).map.layerGroups.layerList));

    const nonSpatialLayers = layers
        .filter(l => workspace && workspace.layers
            .find(wl => wl.layerId === l.id && l.type === 'agfl'));

    nonSpatialLayers.forEach(async (nonSpatialLayer) => {
        const nonSpatialWorkspace = workspace && workspace.layers
            .filter(wl => nonSpatialLayer.id === wl.layerId);

        dispatch(addNonSpatialContentToTable(
            nonSpatialLayer,
            getWorkspaceFeatures(nonSpatialWorkspace),
        ));
    });
};

export const setWorkspace = () => (dispatch: Function) => {
    dispatch({ type: types.CLEAR_TABLE_DATA });
    dispatch({ type: types.SET_WORKSPACE });
};

export const setWorkspaceRejected = () => (dispatch: Function) => {
    dispatch({ type: types.SET_WORKSPACE_REJECTED });
};
