import { getHeadersLayerGroup } from '../config';

export const fetchLayerGroups = () => (
    fetch('api/layergroup', { headers: getHeadersLayerGroup() })
        .then(r => r.json())
        .then(layerGroups => layerGroups.map(lg => (
            {
                ...lg,
                layers: lg.layers.map(l => ({
                    ...l,
                    active: l.visible,
                })),
            }
        )))
);
