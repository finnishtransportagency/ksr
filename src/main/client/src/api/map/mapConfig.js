import { config } from '../config';

export const fetchMapConfig = () => (
    fetch('api/map', config())
        .then(r => r.json())
);
