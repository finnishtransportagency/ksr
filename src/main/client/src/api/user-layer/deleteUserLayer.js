import { getHeaders } from '../config';

export const deleteUserLayer = layerId => fetch(`api/user-layer/${encodeURIComponent(layerId)}`, {
    headers: getHeaders(),
    method: 'DELETE',
});

