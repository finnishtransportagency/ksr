import { project } from '../projection';

/**
 * Creates a Google Street View link to given location, and opens thath in a new browser tab.
 *
 * @param {number} x X-coordinate in EPSG:3067.
 * @param {number} y Y-coordinate in EPSG:3067.
 * @returns {void}
 */
export const getStreetViewLink = (x, y) => {
    const wgs84Coords = project('EPSG:3067', 'EPSG:4326', [x, y]);
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${wgs84Coords[1]},${wgs84Coords[0]}`;
    return window.open(streetViewUrl, '_blank');
};
