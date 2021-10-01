// @flow
import { loadModules } from 'esri-loader';

/**
 * Creates an esri.Graphic for highlight purposes from given geometry.
 *
 * Reason that this method takes Graphic as parameters is that then we can keep
 * this method synchronous. (No need for esri-loader).
 *
 * @param {Object} geometry esri.geometry.Geometry object to be used in the Graphic.
 * @param {Object} Graphic Graphic class, that is then used to create new objects.
 *
 * @returns Graphic Returns Graphic if geometry is one of supported types otherwise null.
 */
export const createGraphic = (
    geometry: Object,
    Graphic: any,
) => {
    if (
        geometry === null
        || geometry === undefined
    ) {
        return null;
    }
    switch (geometry.type) {
        case 'point':
            return new Graphic({
                geometry,
                symbol: {
                    type: 'simple-marker',
                    color: [0, 0, 0, 0],
                    style: 'circle',
                    size: 8,
                    outline: {
                        color: [0, 0, 0, 0.5],
                        width: 1,
                    },
                },
                id: 'buffer',
            });
        case 'polygon':
            return new Graphic({
                geometry,
                symbol: {
                    type: 'simple-fill',
                    color: [140, 140, 222, 0.5],
                    outline: {
                        color: [0, 0, 0, 0.5],
                        width: 2,
                    },
                },
                id: 'buffer',
            });
        case 'polyline':
            return new Graphic({
                geometry,
                symbol: {
                    type: 'simple-line',
                    style: 'solid',
                    color: [0, 0, 0, 0.5],
                    width: 1,
                },
                id: 'buffer',
            });
        default:
            return null;
    }
};

/**
 * Change polygon (rings) or point (x, y) data into proper esri geometry to work with buffer.
 *
 * @param view Esri map view.
 * @param geomToBuffer List of geometry data, that isn't properly initialized as esri geometry.
 *
 * @returns {Promise<Array<*>>} List of Point or Polygon geometry.
 */
const initializeToGeometry = async (view: Object, geomToBuffer: Object[]) => {
    const [Point, Polygon] = await loadModules([
        'esri/geometry/Point',
        'esri/geometry/Polygon',
    ]);

    const createPoint = geom => new Point({
        x: geom.x,
        y: geom.y,
        spatialReference: view.spatialReference,
    });

    const createPolygon = geom => new Polygon({
        rings: geom.rings,
        spatialReference: view.spatialReference,
    });

    return geomToBuffer[0].rings
        ? geomToBuffer.map(geom => (geom.initialized ? geom : createPolygon(geom)))
        : geomToBuffer.map(geom => (geom.initialized ? geom : createPoint(geom)));
};

/**
 * Set buffer for selected features (geometry).
 *
 * @param {Object} view Esri map view.
 * @param {Object[]} selectedGeometryData Array of selected geometry data.
 * @param {Object[]} tableGeometryData Array of every geometry data in table.
 * @param {number} distance Buffer size in meters.
 * @param {boolean} [currentTableOnly] Whether current table only is selected or not.
 * @param {boolean} [selectedFeaturesOnly] Whether selected features only is selected or not.
 * @param {string} [activeLayerId] Currently active layer on table.
 */
export const setBuffer = async (
    view: Object,
    selectedGeometryData: Object[],
    tableGeometryData: Object[],
    distance: number,
    currentTableOnly?: boolean,
    selectedFeaturesOnly?: boolean,
    activeLayerId?: string,
) => {
    const [Graphic, geometryEngine] = await loadModules([
        'esri/Graphic',
        'esri/geometry/geometryEngine',
    ]);

    if (view && (tableGeometryData.length > 0 || selectedGeometryData.length > 0)) {
        const featureData = selectedFeaturesOnly
            ? selectedGeometryData
            : tableGeometryData;

        let geomToBuffer = currentTableOnly
            ? featureData
                .filter(data => data.layerId === activeLayerId)
                .map(data => data.geometry)
            : featureData.map(data => data.geometry);

        // Geometry not properly initialized for buffering
        if (geomToBuffer.some(geom => !geom.initialized)) {
            geomToBuffer = await initializeToGeometry(view, geomToBuffer);
        }

        if (geomToBuffer.length > 0) {
            const featureBuffers = geometryEngine.buffer(
                geomToBuffer, [
                    distance,
                ], 'meters',
                true,
            );

            const bufferGraphic = createGraphic(
                featureBuffers[0],
                Graphic,
            );
            view.graphics.add(bufferGraphic);
        }
    }
};

/**
 * Set buffer for a single feature selected from map.
 *
 * @param {Object} view Esri map view
 * @param {Object[]} selectedGeometryData Array of containing selected feature from map.
 * @param {number} distance Buffer size in meters.
 */
export const setSingleFeatureBuffer = (
    view: Object,
    selectedGeometryData: Object[],
    distance: number,
) => {
    loadModules([
        'esri/Graphic',
        'esri/geometry/geometryEngine',
    ])
        .then(([
            Graphic,
            geometryEngine,
        ]) => {
            if (view && selectedGeometryData.length > 0) {
                const featureBuffers = geometryEngine.buffer(
                    selectedGeometryData, [
                        distance,
                    ], 'meters',
                    true,
                );

                const bufferGraphic = createGraphic(
                    featureBuffers[0],
                    Graphic,
                );

                view.graphics.add(bufferGraphic);
            }
        });
};
