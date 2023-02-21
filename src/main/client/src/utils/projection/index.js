// @flow
import proj4 from 'proj4';

proj4.defs([
    ['EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
]);

/**
 * Projects array of coordinates from sSrs to tSrs.
 *
 * Coordinates can be a flat array or nested array. The returned array has same
 * shape than input array.
 *
 * @param {string} sSrs EPSG code for source Spatial Reference System.
 * @param {string} tSrs EPSG code for target Spatial Reference System.
 * @param {any[]} coords Array of coordinates.
 * @returns {any[]} Array of projected coordinates.
 */
export const project = (
    sSrs: string,
    tSrs: string,
    coords: any[],
): any => {
    // $FlowFixMe
    if (Array.isArray(coords) && coords.length && coords.every(Number.isFinite)) {
        return proj4(sSrs, tSrs, coords);
    }
    return coords.reduce((acc, cur) => [...acc, project(sSrs, tSrs, cur)], []);
};
