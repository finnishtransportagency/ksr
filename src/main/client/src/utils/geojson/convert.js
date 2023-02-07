// @flow

// import { loadModules } from 'esri-loader';

import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import Point from '@arcgis/core/geometry/Point';
import Multipoint from '@arcgis/core/geometry/Multipoint';

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
): any => {
    const coordinates = sSrs !== tSrs
        ? project(`EPSG:${sSrs}`, `EPSG:${tSrs}`, geom.coordinates) : geom.coordinates;

    switch (geom.type.toLowerCase()) {
        case 'point': {
            let newPoint = await new Point();

            newPoint = {
                ...newPoint, x: coordinates[0], y: coordinates[1], spatialReference: { wkid: tSrs },
            };

            return newPoint;
        }
        case 'polyline':
        case 'linestring': {
            let newPoly = await new Polyline();
            newPoly = {
                ...newPoly,
                paths: geom.coordinates,
                spatialReference: { wkid: tSrs },
            };
            return newPoly;
        }
        case 'multipolygon': {
            const rings = [geom.coordinates.flatMap(c => c)];
            let newPolygon = await new Polygon();
            newPolygon = {
                ...newPolygon,
                rings,
                spatialReference: { wkid: tSrs },
            };

            return newPolygon;
        }
        case 'polygon': {
            let newPolygon = new Polygon();
            newPolygon = {
                ...newPolygon,
                rings: geom.coordinates,
                spatialReference: { wkid: tSrs },
            };
            return newPolygon;
        }
        case 'multipoint': {
            let newMultipoint = await new Multipoint();
            newMultipoint = {
                ...newMultipoint,
                points: geom.coordinates,
                spatialReference: { wkid: tSrs },
            };
            return newMultipoint;
        }
        default:
            return null;
    }
};

export default convert;
