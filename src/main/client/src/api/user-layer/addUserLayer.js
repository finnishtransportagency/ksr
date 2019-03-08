import { config } from '../config';

export const fetchAddUserLayer = data => fetch('api/user-layer', {
    ...config(),
    method: 'POST',
    body: JSON.stringify(data),
})
    .then(r => r.json());
