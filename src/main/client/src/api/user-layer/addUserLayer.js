import { getHeaders } from '../config';

export const fetchAddUserLayer = data => fetch('api/user-layer', {
    headers: getHeaders(),
    method: 'POST',
    body: JSON.stringify(data),
})
    .then(r => r.json());
