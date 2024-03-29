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
export const getWorkspaceFeatures = (workspace: Array<Object>): Array<{ featureId: number, layerId: any, selected: any, ... }> => {
    const workspaceFeatures = [];
    if (workspace) {
        workspace.forEach((layer) => {
            if (!layer.definitionExpression) {
                layer.selectedFeaturesList.forEach(feature => workspaceFeatures.push({
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
 * @returns {Promise<Object>} List of layer feature data.
 */
export const queryWorkspaceFeatures = (
    workspaceFeatures: Object[],
    view: Object,
): Promise<Object> => new Promise((resolve) => {
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
                            const selectedObj = workspaceFeatures
                                .find(obj => obj.featureId === f.attributes[layer.objectIdField]);
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
                    .catch(err => console.error(err)));
            }
        }
    });
    Promise.all(queries).then((layers) => {
        resolve({ layers });
    });
});

/**
 * Find layer using layerId or userLayerId from a list.
 * @param {Object[]} list Workspace list of layers.
 * @param {Object} layer workspace layer.
 * @returns {Object} Found layer from the list.
 */
const findLayer = (list: any, layer: any) => list
    .find(l => (layer.layerId || layer.userLayerId).replace('_s', '') === (l.id || l.userLayerId));

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
export const updateLayerList = (workspace: Object, layerList: Object[]): Object[] => workspace
    .layers.reduce((acc, wLayer) => {
        const match = findLayer(acc, wLayer);
        if (match && wLayer.definitionExpression) {
            return [
                ...acc,
                {
                    ...match,
                    id: `${match.id}_s`,
                    definitionExpression: wLayer.definitionExpression,
                    opacity: wLayer.opacity,
                    layerOrder: wLayer.layerOrder,
                    visible: false,
                    active: false,
                    _source: 'search',
                },
            ];
        }
        if (match !== undefined) {
            return acc.map(l => ({
                ...l,
                opacity: l.id === match.id ? wLayer.opacity : l.opacity,
                layerOrder: l.id === match.id ? wLayer.layerOrder : l.layerOrder,
                visible: false,
                active: false,
            }));
        }
        return acc.map(l => l);
    }, layerList.filter(l => l._source !== 'shapefile' && !l.definitionExpression))
    .sort((a, b) => a.layerOrder - b.layerOrder);

/**
 * Create map with layers and query strings that can be used to query searches saved in workspace.
 *
 * @param {Object} workspace User specific workspace settings.
 * @param {Object[]} layerList List of layers.
 *
 * @returns {Map<Object, string>} Map with layer as key and query string as value
 */
export const searchQueryMap = (
    workspace: Object,
    layerList: Object[],
): Map<Object, string> => new Map(workspace.layers
    .filter(layer => layer.definitionExpression)
    .map(layer => [{
        ...layer,
        layer: layerList.find(l => l.definitionExpression
        && (l.id.replace('_s', '') === layer.layerId
            || l.id.replace('_s', '') === layer.userLayerId)),
    },
    layer.definitionExpression]));

/**
 * Loads given workspace.
 *
 * @param {Object} workspace User specific workspace settings.
 * @param {Object[]} layerList List of layers.
 * @param {Object} view Esri map view.
 * @param {Function} activateLayers Redux function that handles layer activation.
 * @param {Function} deactivateLayer Redux function that handles layer deactivation.
 * @param {Function} [updateWorkspaces] Redux function that handles workspace fetches.
 *
 * @returns {void}
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

    const workspaceLayers = workspaceLayerList
        .filter(l => (l.definitionExpression
            ? workspace.layers.find(wl => wl.definitionExpression
                && (wl.layerId === l.id.replace('_s', '')
                    || wl.userLayerId === l.id.replace('_s', '')))
            : workspace.layers.find(wl => wl.layerId === l.id || wl.userLayerId === l.id)));

    workspaceLayerList.forEach((l) => {
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
export const getWorkspaceFromUrl = async (): any => {
    const urlParams = new URLSearchParams(window.location.search);
    const workspaceUuid = urlParams.get('workspace');
    return workspaceUuid && getWorkspaceUuid(workspaceUuid);
};
