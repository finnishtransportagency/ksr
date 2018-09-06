// @flow
import * as shapefile from 'shapefile';
import esriLoader from 'esri-loader';
import { mapShapefileHighlight as highlight } from '../components/ui/defaultStyles';
import { convertEsriGeometryType, dataType } from './type';

/**
 * Create Esri geometry type
 * @param geometry
 * @param Point
 * @param Polyline
 * @param Polygon
 * @param Multipoint
 * @returns Esri geometryType
 */
export const createGeometry = (
    geometry: Object,
    Point: Function,
    Polyline: Function,
    Polygon: Function,
    Multipoint: Function,
) => {
    if (
        geometry === null
        || geometry === undefined
    ) {
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
                hasZ: true,
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
 * Create Esri attribute information from geojson properties
 * @param properties
 * @param index
 * @returns attributes
 */
export const createAttributes = (properties: Array<any>, index: number) => {
    const attributes = {};
    attributes.ObjectID = index;
    Object.entries(properties).forEach(([key, value]) => {
        attributes[key] = value;
    });
    return attributes;
};

/**
 * Create Graphics from geojson data
 * @param geoJson
 * @param Point
 * @param Polyline
 * @param Polygon
 * @param Multipoint
 * @returns geometry and attributes
 */
export const createGraphics = (
    geoJson: Object,
    Point: Function,
    Polyline: Function,
    Polygon: Function,
    Multipoint: Function,
) =>
    // Create an array of Graphics from each GeoJSON feature
    geoJson.features.map((feature, i) => ({
        geometry: createGeometry(feature.geometry, Point, Polyline, Polygon, Multipoint),
        // select only the attributes you care about
        attributes: createAttributes(feature.properties, i),
    }));

/**
 * Create symbol for renderer
 * @param geometry Object geometry of the feature
 * @returns renderer for featureLayer
 */
export const createSymbol = (geometry: Object) => {
    if (
        geometry === null
        || geometry === undefined

    ) {
        return null;
    }

    switch (geometry.type) {
        case 'point':
        case 'multipoint':
            return {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-marker',
                    color: highlight,
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
                    color: highlight,
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
                    color: highlight,
                    width: 2,
                },
            };
        default:
            return null;
    }
};

/**
 * Create EsriFieldTypes
 * @param attributes geojson attributes
 * @returns Array of fields
 */
export const createFields = (attributes: Object) => {
    const fields = [];
    let fieldObj = {};
    Object.entries(attributes).forEach(([key, value]) => {
        fieldObj = {};
        fieldObj.name = key;
        fieldObj.alias = key;
        if (key === 'ObjectID') {
            fieldObj.type = 'esriFieldTypeOID';
        } else {
            fieldObj.type = dataType(value);
        }
        fields.push(fieldObj);
    });

    return fields;
};
/**
 * Convert layer to LayerList format
 * @param layer
 * @param fileName
 * @returns new LayerList formatted Object
 */
export const convertLayerListFormat = (layer: Object, fileName: string) => {
    const newLayer = {};

    newLayer.active = true;
    newLayer.attribution = '';
    newLayer.authentication = '';
    newLayer.geometryType = convertEsriGeometryType(layer.geometryType);
    newLayer.fields = layer.fields && layer.fields.map((f, index) => ({
        value: index, label: f.alias, type: f.type, name: f.name,
    }));
    newLayer.id = layer.id;
    newLayer.layerOrder = layer.id;
    newLayer.layers = fileName;
    newLayer.maxScale = 0;
    newLayer.minScale = 0;
    newLayer.name = fileName;
    newLayer.opacity = 1;
    newLayer.queryColumns = null;
    newLayer.queryable = false;
    newLayer.styles = 'default';
    newLayer.transparent = true;
    newLayer.type = 'agfs';
    newLayer.url = null;
    newLayer.visible = true;
    newLayer.source = 'shapefile';

    return newLayer;
};

/**
 * Create FeatureLayer to MapView
 * @param graphics Object
 * @param fileName string name of the shapefile
 * @param FeatureLayer Function
 * @param view Object esri map view
 * @param layerList Array
 * @param addShapefile Function
 */
export const createLayer = (
    graphics: Object,
    fileName: string,
    FeatureLayer: Function,
    view: Object,
    layerList: Array<any>,
    addShapefile: Function,
) => {
    if (graphics.length < 1 || graphics[0].geometry === null) return;
    const maxId = Math.max(...layerList.map(lg => lg.id));

    const layer = new FeatureLayer({
        id: maxId + 11000,
        source: graphics, // autocast as an array of esri/Graphic
        // create an instance of esri/layers/support/Field for each field object
        fields: createFields(graphics[0].attributes),
        objectIdField: 'ObjectID', // This must be defined when creating a layer from Graphics
        renderer: createSymbol(graphics[0].geometry),
        spatialReference: { wkid: 3067 },
        geometryType: graphics[0].geometry.type, // Must be set when creating a layer from Graphics
        outFields: ['*'],
        title: fileName,
        maxScale: 0,
        minScale: 0,
        featureType: 'shapefile',
        _source: 'shapefile',
    });

    view.map.add(layer);
    addShapefile(convertLayerListFormat(layer, fileName));
};

/**
 * Tool for creating geojson from shapefile
 * @param contents
 * @param fileName
 * @param view
 * @param layerList
 * @param addShapefile
 */
export const shape2geoJson = (
    contents: any,
    fileName: string,
    view: Object,
    layerList: Array<any>,
    addShapefile: Function,
) => {
    esriLoader
        .loadModules([
            'esri/layers/FeatureLayer',
            'esri/geometry/Point',
            'esri/geometry/Polyline',
            'esri/geometry/Polygon',
            'esri/geometry/Multipoint',
        ])
        .then(([
            FeatureLayer,
            Point,
            Polyline,
            Polygon,
            Multipoint,
        ]) => {
            if (contents.shp && contents.dbf) {
                shapefile.read(contents.shp, contents.dbf)
                    .then((geojson) => {
                        const graphics = createGraphics(
                            geojson,
                            Point,
                            Polyline,
                            Polygon,
                            Multipoint,
                        );
                        createLayer(
                            graphics,
                            fileName,
                            FeatureLayer,
                            view,
                            layerList,
                            addShapefile,
                        );
                    });
            }
        });
};
