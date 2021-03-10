// @flow

import { loadModules } from 'esri-loader';
import { project } from '../projection';

/**
 * Convert a GeoJSON geometry into ArcGIS JS API 4 compatible geometry.
 *
 * @todo Add support for other geometry types when necessary.
 *
 * @param {Object} geom GeoJSON geometry.
 * @param {number} [sSrs = 3067] sSrs Source Spatial Reference System for geometry.
 * @param {number} [tSrs = 3067] tSrs Target Spatial Reference System for geometry.
 * @return {esri.geometry.Geometry} A subclass of esri.geometry.Geometry.
 */
const convert = async (
    geom: Object,
    sSrs: number = 3067,
    tSrs: number = 3067,
) => {
    const [
        Point,
        Polyline,
        Polygon,
        Multipoint,
    ] = await loadModules([
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/geometry/Multipoint',
    ]);

    const coordinates = sSrs !== tSrs
        ? project(`EPSG:${sSrs}`, `EPSG:${tSrs}`, geom.coordinates) : geom.coordinates;

    switch (geom.type.toLowerCase()) {
        case 'point':
            return new Point({
                x: coordinates[0],
                y: coordinates[1],
                spatialReference: { wkid: tSrs },
            });
        case 'polyline':
        case 'linestring':
            return new Polyline({
                paths: geom.coordinates,
                spatialReference: { wkid: tSrs },
            });
        case 'multipolygon':
            return new Polygon({
                rings: geom.coordinates.flatMap(c => c),
                spatialReference: { wkid: tSrs },
            });
        case 'polygon':
            return new Polygon({
                rings: geom.coordinates,
                spatialReference: { wkid: tSrs },
            });
        case 'multipoint':
            return new Multipoint({
                points: geom.coordinates,
                spatialReference: { wkid: tSrs },
            });
        default:
            return null;
    }
};

export default convert;
