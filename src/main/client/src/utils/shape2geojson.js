// @flow
import * as shapefile from 'shapefile';
import esriLoader from 'esri-loader';
import moment from 'moment';
import { colorShapefileHighlight } from '../components/ui/defaultStyles';
import { convert } from './geojson';
import { getLegendSymbol } from './layerLegend';
import strings from '../translations';

/**
 * Create Esri geometry type.
 *
 * @param {Object} geometry Features geometry.
 * @param {Function} Point esri/geometry/Point.
 * @param {Function} Polyline esri/geometry/Polyline.
 * @param {Function} Polygon esri/geometry/Polygon.
 * @param {Function} Multipoint esri/geometry/Multipoint.
 *
 * @returns Esri geometryType.
 */
export const createGeometry = (
    geometry: Object,
    Point: Function,
    Polyline: Function,
    Polygon: Function,
    Multipoint: Function,
) => {
    if (geometry === null || geometry === undefined) {
        return null;
    }

    switch (geometry.type.toLowerCase()) {
        case 'point':
            return new Point({
                x: geometry.coordinates[0],
                y: geometry.coordinates[1],
                spatialReference: { wkid: 3067 },
            });
        case 'polyline':
        case 'linestring':
            return new Polyline({
                hasZ: false,
                hasM: true,
                paths: geometry.coordinates,
                spatialReference: { wkid: 3067 },
            });
        case 'polygon':
            return new Polygon({
                hasZ: false,
                hasM: true,
                rings: geometry.coordinates,
                spatialReference: { wkid: 3067 },
            });
        case 'multipoint':
            return new Multipoint({
                hasZ: false,
                hasM: true,
                points: geometry.coordinates,
                spatialReference: { wkid: 3067 },
            });
        default:
            return null;
    }
};

/**
 * Create Esri attribute information from geojson properties.
 *
 * @param {Object[]} properties List of feature attributes.
 * @param {number} index Running index number.
 *
 * @returns {Object[]} List of attributes.
 */
export const createAttributes = (properties: Object[], index: number) => {
    const attributes = {};
    attributes.ObjectID = index;
    Object.entries(properties).forEach(([key, value]) => {
        if (value instanceof Date) {
            attributes[key] = moment(value).format('DD.MM.YYYY');
        } else {
            // No need to validate imported shape data as it is not editable.
            attributes[key] = String(value);
        }
    });
    return attributes;
};

/**
 * Create Graphics from geojson data.
 *
 * @param {Object} geoJson Shapefile as geojson.
 *
 * @returns {Promise<Object[]>} List of geometries and attributes
 */
export const createGraphics = (geoJson: Object) => Promise.all(geoJson
    .features.map(async (feature, i) => ({
        geometry: await convert(feature.geometry, 3067, 3067),
        attributes: createAttributes(feature.properties, i),
    })));

/**
 * Create symbol for renderer.
 *
 * @param {Object} geometry Features geometry.
 *
 * @returns {Object} Renderer for featureLayer.
 */
export const createSymbol = (geometry: Object) => {
    if (geometry === null || geometry === undefined) {
        return null;
    }

    switch (geometry.type) {
        case 'point':
        case 'multipoint':
            return {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-marker',
                    color: colorShapefileHighlight,
                    style: 'circle',
                    size: 8,
                    outline: {
                        color: '#000000',
                        width: 1,
                    },
                },
            };
        case 'polygon':
            return {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-fill',
                    color: colorShapefileHighlight,
                    style: 'solid',
                    outline: {
                        color: '#000000',
                        width: 1,
                    },
                },
            };
        case 'polyline':
            return {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-line',
                    style: 'solid',
                    color: colorShapefileHighlight,
                    width: 2,
                },
            };
        default:
            return null;
    }
};

/**
 * Create EsriFieldTypes.
 *
 * @param {Object} attributes Geojson attributes.
 *
 * @returns {Object[]} List of fields.
 */
export const createFields = (attributes: Object) => {
    const fields = [];
    let fieldObj = {};
    Object.entries(attributes).forEach(([key]) => {
        fieldObj = {};
        fieldObj.name = key;
        fieldObj.alias = key;
        if (key === 'ObjectID') {
            fieldObj.type = 'esriFieldTypeOID';
        } else {
            fieldObj.type = 'esriFieldTypeString';
        }
        fields.push(fieldObj);
    });

    return fields;
};

/**
 * Convert layer to LayerList format.
 *
 * @param {Object} layer Feature layer.
 * @param {string} fileName Given layer name.
 *
 * @returns {Object} LayerList formatted Object.
 */
export const convertLayerListFormat = (layer: Object, fileName: string) => ({
    active: true,
    attribution: '',
    authentication: '',
    fields: layer.fields && layer.fields.map((f, index) => ({
        value: index, label: f.alias, type: f.type, name: f.name,
    })),
    id: layer.id,
    layerGroupName: strings.mapLayers.userLayerGroupName,
    layerOrder: layer.id,
    layers: fileName,
    maxScale: 0,
    minScale: 0,
    name: fileName,
    legendSymbol: layer.legendSymbol,
    opacity: 1,
    queryColumnsList: null,
    queryable: false,
    styles: 'default',
    transparent: true,
    type: 'agfs',
    url: null,
    visible: true,
    _source: 'shapefile',
});

/**
 * Create FeatureLayer to MapView.
 *
 * @param {Object[]} graphics List with graphics data.
 * @param {string} fileName Name of the shapefile.
 * @param {Function} FeatureLayer esri/layers/FeatureLayer.
 * @param {Object} view esri/views/MapView.
 * @param {Object[]} layerList List of layers.
 * @param {Function} addShapefile Redux action to add shapefile layer to layerList.
 */
export const createLayer = async (
    graphics: Object,
    fileName: string,
    FeatureLayer: Function,
    view: Object,
    layerList: Array<any>,
    addShapefile: Function,
) => {
    if (graphics.length < 1 || graphics[0].geometry === null) return;
    const maxId = layerList.map(ll => parseInt(ll.id, 10)).reduce((a, b) => Math.max(a, b));

    const layer = new FeatureLayer({
        id: maxId + 11000,
        source: graphics, // autocast as an array of esri/Graphic
        // create an instance of esri/layers/support/Field for each field object
        fields: createFields(graphics[0].attributes),
        objectIdField: 'ObjectID', // This must be defined when creating a layer from Graphics
        renderer: createSymbol(graphics[0].geometry),
        outFields: ['*'],
        title: fileName,
        maxScale: 0,
        minScale: 0,
        featureType: 'shapefile',
        _source: 'shapefile',
    });

    layer.legendSymbol = await getLegendSymbol(layer.renderer.symbol.clone());
    view.map.add(layer);
    addShapefile(convertLayerListFormat(layer, fileName));
};

/**
 * Tool for creating geojson from shapefile
 *
 * @param {Object} contents Content of dbf and shp files.
 * @param {string} fileName Name of the given layer name.
 * @param {Object} view esri/views/MapView.
 * @param {Object[]} layerList List of layers.
 * @param {Function} addShapefile Redux action to add shapefile layer to layerList.
 * @returns {void}
 */
export const shape2geoJson = async (
    contents: Object,
    fileName: string,
    view: Object,
    layerList: Array<any>,
    addShapefile: Function,
) => {
    const [FeatureLayer] = await esriLoader.loadModules(['esri/layers/FeatureLayer']);
    if (contents.shp && contents.dbf) {
        const geojson = await shapefile.read(contents.shp, contents.dbf);
        const graphics = await createGraphics(geojson);
        await createLayer(graphics, fileName, FeatureLayer, view, layerList, addShapefile);
    }
};
