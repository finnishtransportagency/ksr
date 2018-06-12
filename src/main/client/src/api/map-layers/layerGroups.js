import { getHeadersLayerGroup } from '../config';

export const fetchLayerGroups = () => (
    fetch('api/layergroup', { headers: getHeadersLayerGroup() })
        .then(r => r.json())
);
