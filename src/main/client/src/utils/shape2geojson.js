// @flow
import * as shapefile from 'shapefile';
// import { loadModules } from 'esri-loader';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import { convert } from './geojson';
import { getLegendSymbol } from './layerLegend';
import { toDisplayDate } from './date';
import strings from '../translations';

/**
 * Create Esri attribute information from geojson properties.
 *
 * @param {Object[]} properties List of feature attributes.
 * @param {number} index Running index number.
 *
 * @returns {Object[]} List of attributes.
 */
const createAttributes = (properties: Object, index: number) => {
    const attributes: Object = {};
    attributes.ObjectID = index;
    Object.entries(properties).forEach(([key, value]) => {
        if (value instanceof Date) {
            attributes[key] = toDisplayDate(value);
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
 * @returns {Promise<Object[]>} List of geometries and attributes.
 */
const createGraphics = (geoJson: Object) => Promise.all(geoJson
    .features.map(async (feature, i) => ({
        geometry: await convert(feature.geometry, 3067, 3067),
        attributes: createAttributes(feature.properties, i),
    })));

/**
 * Create symbol for renderer.
 *
 * @param {Object} geometry Features geometry.
 * @param {?string} color Hex Color Code representation of the symbol color.
 *
 * @returns {Object} Renderer for featureLayer.
 */
const createSymbol = (geometry: Object, color: ?string) => {
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
                    color,
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
                    color,
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
                    color,
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
 * @param {Object} attributes GeoJson attributes.
 *
 * @returns {Object[]} List of fields.
 */
const createFields = (attributes: Object) => {
    const fields = [];
    Object.entries(attributes).forEach(([key]) => {
        const fieldObj: Object = {};
        fieldObj.name = key;
        fieldObj.alias = key;
        if (key === 'ObjectID') {
            fieldObj.type = 'oid';
        } else {
            fieldObj.type = 'string';
        }
        fields.push(fieldObj);
    });

    return fields;
};

/**
 * Convert layer to LayerList format.
 *
 * @param {Object} layer Feature layer.
 *
 * @returns {Object} LayerList formatted Object.
 */
export const convertLayerListFormat = (layer: Object): {
  _source: string,
  active: boolean,
  attribution: string,
  authentication: string,
  fields: any,
  id: any,
  layerGroupName: any,
  layerOrder: any,
  layers: any,
  legendSymbol: any,
  maxScale: number,
  minScale: number,
  name: any,
  opacity: number,
  queryColumnsList: null,
  queryable: boolean,
  styles: string,
  transparent: boolean,
  type: string,
  url: null,
  visible: boolean,
  ...
} => ({
    active: true,
    attribution: '',
    authentication: '',
    fields: layer.fields && layer.fields.map((f, index) => ({
        value: index, label: f.alias, type: f.type, name: f.name,
    })),
    id: layer.id,
    layerGroupName: strings.mapLayers.userLayerGroupName,
    layerOrder: layer.id,
    layers: layer.title,
    maxScale: 0,
    minScale: 0,
    name: layer.title,
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
 * Create FeatureLayer from list of graphics.
 *
 * @param {Object[]} graphics List of ArcGIS JS Graphics.
 * @param {string} fileName Name of the Shapefile.
 * @param {number} id  Id of the layer.
 * @param {?string} color Hex Color Code representation of the symbol color.
 *
 * @returns {?Object} Created layer if created, otherwise null.
 */
const createLayer = async (
    graphics: Object,
    fileName: string,
    id: number,
    color: ?string,
) => {
    if (graphics.length < 1 || graphics[0].geometry === null) {
        return null;
    }

    const layer = new FeatureLayer({
        id,
        source: graphics, // autocast as an array of esri/Graphic
        // create an instance of esri/layers/support/Field for each field object
        fields: createFields(graphics[0].attributes),
        objectIdField: 'ObjectID', // This must be defined when creating a layer from Graphics
        objectIdFieldName: 'ObjectID',
        renderer: createSymbol(graphics[0].geometry, color),
        outFields: ['*'],
        title: fileName,
        maxScale: 0,
        minScale: 0,
        featureType: 'shapefile',
        _source: 'shapefile',
    });

    if (layer.renderer && layer.renderer.symbol && layer.renderer.symbol.clone) {
        layer.legendSymbol = await getLegendSymbol(layer.renderer.symbol.clone());
    }
    return layer;
};

/**
 * Convert a shapefile into ArcGIS JS FeatureLayer.
 *
 * @param {ArrayBuffer} shp Content of the shp -file as an ArrayBuffer.
 * @param {ArrayBuffer} dbf Content of the dbf -file as an ArrayBuffer.
 * @param {string} layerName Name of the given layer name.
 * @param {number} id Id of the layer to be created.
 * @param {?string} color Hex Color Code representation of the symbol color.
 *
 * @returns {?Object} Created layer if created otherwise null.
 */
export const shape2geoJson = async (
    shp: ArrayBuffer,
    dbf: ArrayBuffer,
    layerName: string,
    id: number,
    color: ?string,
): Promise<null> => {
    if (shp && dbf) {
        const geojson = await shapefile.read(shp, dbf);
        const graphics = await createGraphics(geojson);
        return createLayer(graphics, layerName, id, color);
    }
    return Promise.resolve(null);
};
