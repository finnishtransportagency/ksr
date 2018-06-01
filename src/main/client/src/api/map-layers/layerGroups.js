import { getHeadersLayerGroup } from '../config';

export const getLayerGroups = () => (
    fetch('api/layergroup', { headers: getHeadersLayerGroup() })
        .then(r => r.json())
);
