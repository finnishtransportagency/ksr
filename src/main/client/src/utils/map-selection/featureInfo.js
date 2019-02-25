// @flow
import querystring from 'querystring';
import { getFeatureInfo as getFeatureInfoRequest } from '../../api/map/featureInfo';

/**
 * Creates an WMS compliant getFeatureInfoUrl.
 *
 * @param {Object} layer Layer object.
 * @param {number} x Screen x-coordinate (pixels).
 * @param {number} y Screen y-coordinate (pixels).
 * @param {Object} extent Extent of the mapview (geographical coordinates).
 * @param {number} height Height of the mapview (in pixels).
 * @param {number} width Width of the mapview (in pixels).
 *
 * @returns {string} GetFeatureInfo url.
 */
const createGetFeatureInfoUrl = (
    layer: Object,
    x: number,
    y: number,
    extent: Object,
    height: number,
    width: number,
) => (
    `${layer.url}?${querystring.stringify({
        request: 'GetFeatureInfo',
        service: 'WMS',
        version: '1.1.1',
        layers: layer.layers,
        styles: '',
        srs: 'EPSG:3067',
        bbox: `${extent.xmin},${extent.ymin},${extent.xmax},${extent.ymax}`,
        height,
        width,
        query_layers: layer.layers,
        info_format: 'application/json',
        feature_count: 1000,
        x,
        y,
    })}`
);

/**
 * Contructs a esri/Graphic object from WMS GetFeatureInfo response.
 *
 * @param {Object} layer Layer object.
 * @param {Object} content Content of the getFeatureInfo response. Expected to be parsed GeoJSON.
 *
 * @returns {Promise} Promise that will resolve into an Object containing Graphic.
 */
const featureInfoToGraphic = (layer, content) => (
    content.features.map((feat) => {
        // Keep only properties of some primitive type or null.
        // We don't want to display e.g. Arrays or Objects in Popup.
        const properties = Object.keys(feat.properties).reduce((a, c) => {
            if (typeof feat.properties[c] === 'number'
                || typeof feat.properties[c] === 'string'
                || typeof feat.properties[c] === 'boolean'
            ) {
                return a.concat([{ name: c, value: String(feat.properties[c]).trim() }]);
            } if (feat.properties[c] === null) {
                return a.concat([{ name: c, value: '--' }]);
            }
            return a;
        }, []);

        const graphic = {
            attributes: properties.reduce((a, c) => ({ [c.name]: c.value, ...a }), {}),
            popupTemplate: {
                title: layer.name,
                content: [{
                    type: 'fields',
                    fieldInfos: properties.map(property => (
                        { fieldName: property.name, label: property.name, visible: true }
                    )),
                }],
            },
        };
        return { graphic };
    })
);

/**
 * Fetch featureinfo for given layer on given location.
 *
 * @param {Object} layer Layer object.
 * @param {number} x Screen x-coordinate (pixels).
 * @param {number} y Screen y-coordinate (pixels).
 * @param {Object} extent Extent of the mapview (geographical coordinates).
 * @param {number} height Height of the mapview (in pixels).
 * @param {number} width Width of the mapview (in pixels).
 *
 * @returns {Promise} Promise that will resolve or toast an error.
 */
const fetchFeatureInfo = (
    layer: Object,
    x: number,
    y: number,
    extent: Object,
    height: number,
    width: number,
) => {
    const url = createGetFeatureInfoUrl(layer, x, y, extent, height, width);
    return getFeatureInfoRequest(url)
        .then(content => (content ? featureInfoToGraphic(layer, content) : undefined))
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Flatmap implementation.
 *
 * @param {Array} arr Array
 * @param {Function} func Function to apply for each element.
 *
 * @returns {Array} A new array that is flattened and is a result of func.
 */
const flatMap = (arr, func): any[] => (
    arr.reduce((acc, cur) => (acc.concat(func(cur)): any[]), [])
);

/**
 * GetFeatureInfo for given layers.
 *
 * @param {Object[]} layers List of Layer objects.
 * @param {number} x Screen x-coordinate (pixels).
 * @param {number} y Screen y-coordinate (pixels).
 * @param {Object} extent Extent of the mapview (geographical coordinates).
 * @param {number} height Height of the mapview (in pixels).
 * @param {number} width Width of the mapview (in pixels).
 *
 * @returns {Promise} Promise with an Array of featureInfos.
 */
export const getFeatureInfo = async (
    layers: Object[],
    x: number,
    y: number,
    extent: Object,
    height: number,
    width: number,
) => {
    const promises = layers
        .filter(layer => layer.type === 'wms' && layer.active && layer.visible)
        .map(layer => fetchFeatureInfo(layer, x, y, extent, height, width));
    const infos = await Promise.all(promises);

    return flatMap(infos.filter(i => i !== undefined), i => i);
};
