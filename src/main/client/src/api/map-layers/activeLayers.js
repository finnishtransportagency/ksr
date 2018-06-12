import { getHeadersLayerGroup } from '../config';

export const fetchActiveLayers = () => (
    fetch('api/layergroup', { headers: getHeadersLayerGroup() })
        .then(r => r.json())
        .then(r => r.map(lg => lg.layers.filter(l => l.visible)))
);
