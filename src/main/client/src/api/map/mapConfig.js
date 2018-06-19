import { getHeaders } from '../config';

export const fetchMapConfig = () => (
    fetch('api/map', { headers: getHeaders() })
        .then(r => r.json())
);
