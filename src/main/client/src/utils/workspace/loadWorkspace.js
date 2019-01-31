// @flow
import { toast } from 'react-toastify';
import { fetchGetWorkspaceList } from '../../api/workspace/getWorkspaceList';
import { setLayerList } from '../../reducers/map/actions';
import strings from '../../translations';
import { setCenterPoint } from '../map';
import { getWorkspaceUuid } from '../../api/workspace/userWorkspace';
import store from '../../store';

/**
 * Creates list of feature data saved in workspace.
 *
 * @param {Object[]} workspace list of user specific workspace settings.
 *
 * @returns {Object[]} List of layer features saved in workspace.
 */
export const getWorkspaceFeatures = (workspace: Object[]) => {
    const workspaceFeatures = [];
    if (workspace) {
        workspace.forEach((layer) => {
            if (!layer.definitionExpression) {
                layer.selectedFeaturesList.forEach(feature =>
                    workspaceFeatures.push({
                        layerId: layer.layerId === null ? layer.userLayerId : layer.layerId,
                        featureId: parseInt(feature.id, 10),
                        selected: feature.highlight,
                    }));
            }
        });
    }
    return workspaceFeatures;
};

/**
 * Query workspace features saved in workspace.
 * Can be used to add features to table with or without selection.
 *
 * @param {Object[]} workspaceFeatures List of layer features saved in workspace.
 * @param {Object} view Esri map view.
 *
 * @returns {Promise} List of layer feature data.
 */
export const queryWorkspaceFeatures = (
    workspaceFeatures: Object[],
    view: Object,
) => new Promise((resolve) => {
    const queries = [];

    view.map.layers.forEach((layer) => {
        if (layer.queryFeatures) {
            const query = {
                objectIds: workspaceFeatures.filter(obj => obj.layerId === layer.id)
                    .map(filteredObj => filteredObj.featureId),
                outFields: ['*'],
                returnGeometry: true,
            };

            if (query.objectIds.length > 0) {
                queries.push(layer.queryFeatures(query)
                    .then((results) => {
                        results.features.forEach((f) => {
                            const selectedObj = workspaceFeatures.find(obj =>
                                obj.featureId === f.attributes[layer.objectIdField]);
                            if (selectedObj) {
                                f.selected = selectedObj.selected;
                            }
                            return f;
                        });
                        return {
                            id: layer.id,
                            title: layer.title,
                            objectIdFieldName: layer.objectIdField,
                            features: results.features,
                            fields: layer.fields,
                            _source: 'select',
                        };
                    })
                    .catch(err => console.log(err)));
            }
        }
    });
    Promise.all(queries).then((layers) => {
        resolve({ layers });
    });
});

/**
 * Update layer list with workspace settings.
 *
 * Finds all layers saved in workspace data and sets them as active in layer list.
 * Changes opacity, visible and layer order and sorts the list by this order.
 *
 * If layer can't be found in workspace, set visible and active to false.
 *
 * @param {Object} workspace User specific workspace settings.
 * @param {Object[]} layerList List of layers before workspace data.
 *
 * @returns {Object[]} Modified layer list with workspace settings.
 */
export const updateLayerList = (workspace: Object, layerList: Object[]): Object[] => {
    const workspaceIds = workspace.layers.map(w => (w.definitionExpression ? `${w.layerId}.s` : w.layerId || w.userLayerId));
    return layerList.filter(ll => ll._source !== 'shapefile').map((ll) => {
        if (workspaceIds.includes(ll.id)) {
            const ws = ll.definitionExpression
                ? workspace.layers.find(w => w.layerId === ll.id.replace('.s', '')
                    && w.definitionExpression)
                : workspace.layers.find(w => (w.layerId || w.userLayerId) === ll.id
                    && !w.definitionExpression);

            return {
                ...ll,
                opacity: ws.opacity,
                layerOrder: ws.layerOrder,
                visible: false,
                active: false,
            };
        }
        return {
            ...ll,
            visible: false,
            active: false,
        };
    }).sort((a, b) => a.layerOrder - b.layerOrder);
};

/**
 * Create map with layers and query strings that can be used to query searches saved in workspace.
 *
 * @param {Object} workspace User specific workspace settings.
 * @param {Object[]} layerList List of layers.
 *
 * @returns {Map<Object, string>} Map with layer as key and query string as value
 */
export const searchQueryMap = (workspace: Object, layerList: Object[]): Map<Object, string> => {
    const queryMap = new Map();
    workspace.layers.forEach(layer => layer.definitionExpression &&
        queryMap.set(
            {
                ...layer,
                layer: layerList.find(l => l.id === layer.layerId),
            },
            layer.definitionExpression,
        ));
    return queryMap;
};

/**
 * Loads given workspace.
 *
 * @param {Object} workspace User specific workspace settings.
 * @param {Object[]} layerList List of layers.
 * @param {Object} view Esri map view.
 * @param {Function} activateLayers Redux function that handles layer activation.
 * @param {Function} deactivateLayer Redux function that handles layer deactivation.
 * @param {Function} [updateWorkspaces] Redux function that handles workspace fetches.
 */
export const loadWorkspace = async (
    workspace: Object,
    layerList: Object[],
    view: Object,
    activateLayers: Function,
    deactivateLayer: Function,
    updateWorkspaces: ?Function,
) => {
    toast.info(`${strings.workspace.loadingWorkspace} [${workspace.name}]`, {
        toastId: 'loadingWorkspace',
        autoClose: false,
    });

    const workspaceLayerList = updateLayerList(workspace, layerList);
    store.dispatch(setLayerList(workspaceLayerList));

    const workspaceLayers = layerList.filter(l =>
        workspace.layers.find(wl => wl.layerId === l.id || wl.userLayerId === l.id));

    layerList.forEach((l) => {
        if (l.active && !workspaceLayers.some(wl => wl.id === l.id)) {
            deactivateLayer(l.id);
        }
    });

    activateLayers(workspaceLayers, workspace);

    if (updateWorkspaces) updateWorkspaces(fetchGetWorkspaceList);

    view.when(async () => {
        await setCenterPoint(
            [workspace.centerLongitude, workspace.centerLatitude],
            workspace.scale,
            view,
        );
    });
};

/**
 * Loads workspace with workspace uuid if url contains workspace parameter.
 * e.g. /?workspace=<workspace uuid>
 *
 * @returns {Object | null} Found workspace or null.
 */
export const getWorkspaceFromUrl = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const workspaceUuid = urlParams.get('workspace');
    return workspaceUuid && getWorkspaceUuid(workspaceUuid);
};
