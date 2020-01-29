// @flow
import esriLoader from 'esri-loader';

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
export const setBuffer = (
    view: Object,
    selectedGeometryData: Object[],
    tableGeometryData: Object[],
    distance: number,
    currentTableOnly?: boolean,
    selectedFeaturesOnly?: boolean,
    activeLayerId?: string,
) => {
    esriLoader
        .loadModules([
            'esri/Graphic',
            'esri/geometry/geometryEngine',
        ])
        .then(([
            Graphic,
            geometryEngine,
        ]) => {
            if (view && (tableGeometryData.length > 0 || selectedGeometryData.length > 0)) {
                const featureData = selectedFeaturesOnly
                    ? selectedGeometryData
                    : tableGeometryData;

                const geomToBuffer = currentTableOnly
                    ? featureData
                        .filter(a => a.layerId === activeLayerId)
                        .map(a => a.geometry)
                    : featureData.map(a => a.geometry);

                if (geomToBuffer.length > 0) {
                    const featureBuffers = geometryEngine.buffer(
                        geomToBuffer, [
                            distance,
                        ], 'meters',
                        true,
                    );
                    const featureBuffer = featureBuffers[0];

                    // add the buffer to the view as a graphic
                    const bufferGraphic = createGraphic(
                        featureBuffer,
                        Graphic,
                    );

                    view.graphics.add(bufferGraphic);
                }
            }
        });
};
