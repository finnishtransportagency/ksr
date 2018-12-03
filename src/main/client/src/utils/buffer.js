// @flow
import esriLoader from 'esri-loader';

/**
 * Creates an esri.Graphic for highlight purposes from given geometry.
 *
 * Reason that this method takes Graphic and SpatialReference as parameters is
 * that then we can keep this method synchonous. (No need for esri-loader).
 *
 * @param geometry esri.geometry.Geometry Geometry to be used in the Graphic
 * @param srid Spatial reference identifier
 * @param Graphic Graphic class, that is then used to create new objects.
 * @param SpatialReference SpatialReference class, that is used to create a spatialRefence object.
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
 * Set buffer for selected features (geometry)
 * @param view contains Graphic data
 * @param selectedGeometryData Array of geometry data
 * @param distance buffer size
 */
export const setBuffer = (
    view: Object,
    selectedGeometryData: Array<Object>,
    distance: number,
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
            if (view) {
                view.graphics.removeMany(view.graphics.filter(g => g && g.id === 'buffer'));

                if (selectedGeometryData.length > 0) {
                    const featureBuffers = geometryEngine.buffer(
                        selectedGeometryData, [
                            distance,
                        ], 'meters',
                        true,
                    );
                    const featureBuffer = featureBuffers[0];

                    // add the buffer to the view as a graphic
                    const bufferGraphic =
                        createGraphic(
                            featureBuffer,
                            Graphic,
                        );

                    view.graphics.add(bufferGraphic);
                }
            }
        });
};
