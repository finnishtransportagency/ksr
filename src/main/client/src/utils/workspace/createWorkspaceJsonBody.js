// @flow

/**
 * Create workspace values
 *
 * @param workspaceName String given workspace name
 * @param layerList Array of layers
 * @param view Object map view
 * @param selectedFeatures Array feature data in table
 * @returns JSONObject with workspace data to be saved
 */
export const createWorkspaceJsonBody = (
    workspaceName: string,
    layerList: any,
    view: Object,
    selectedFeatures: any,
) => {
    const layers = layerList
        .filter(l => l.active && l.source !== 'shapefile')
        .map((l, i) => ({
            layerId: l.userLayer ? null : parseInt(l.id.replace('.s', ''), 10),
            userLayerId: l.userLayer ? parseInt(l.id, 10) : null,
            visible: l.visible ? '1' : '0',
            opacity: l.opacity,
            layerOrder: i,
            definitionExpression: l.definitionExpression ? l.definitionExpression : '',
            selectedFeatures: selectedFeatures.find(sf => sf.id === l.id)
                ? selectedFeatures
                    .find(sf => sf.id === l.id).data.map(sf => ({
                        id: sf._id,
                        highlight: sf._selected ? '1' : '0',
                    }))
                : [],
        }));

    return {
        name: workspaceName,
        scale: view.scale,
        centerLongitude: view.center.x,
        centerLatitude: view.center.y,
        layers,
    };
};
