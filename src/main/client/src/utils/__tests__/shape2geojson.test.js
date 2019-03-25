import esriLoader from 'esri-loader';
import { shape2geoJson, convertLayerListFormat } from '../shape2geojson';
import { convert } from '../geojson';
import { getLegendSymbol } from '../layerLegend';
import strings from '../../translations';

jest.mock('esri-loader');
jest.mock('../geojson');
jest.mock('../layerLegend');

class FeatureLayerMock {
    constructor(params) {
        Object.entries(params).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}

describe('shape2geojson4', () => {
    const decodeToArrayBuffer = (encoded) => {
        // Taken from: https://stackoverflow.com/a/21797381
        const bs = atob(encoded);
        const len = bs.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
            bytes[i] = bs.charCodeAt(i);
        }
        return bytes.buffer;
    };

    const setup = () => {
        const shp = decodeToArrayBuffer('AAAnCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATugDAAABAAAAwUipZXuFF0HnnE8fQXJZQdOOBzOulxdBETJnKKFzWUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAKAQAAAMFIqWV7hRdBETJnKKFzWUEAAAACAAAACgEAAADTjgczrpcXQeecTx9BcllB');
        const dbf = decodeToArrayBuffer('A3cDGQIAAABhAFsAAAAAAAAAAAAAAAAAAAAAAAAAAABpZAAAAAAAAAAAAE4AAAAACgAAAAAAAAAAAAAAAAAAAHRleHQAAAAAAAAAQwAAAABQAAAAAAAAAAAAAAAAAAAADSAgICAgICAgICAxS2FtcHBpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMkthaXZvcHVpc3RvICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgGg==');
        return { shp, dbf };
    };

    beforeAll(() => {
        esriLoader.loadModules.mockResolvedValue([FeatureLayerMock]);
        convert.mockResolvedValue({
            x: 134,
            y: 131,
            spatialReference: { wkid: 3067 },
            type: 'point',
        });
        getLegendSymbol.mockResolvedValue(null);
    });

    it('shape2geojson - should return null - both shp and dbf undefined', async () => {
        const layer = await shape2geoJson(undefined, undefined, 'Test layer', 2, '#fff');
        expect(layer).toBe(null);
    });

    it('shape2geojson - should return null - shp undefined', async () => {
        const { dbf } = setup();
        const layer = await shape2geoJson(undefined, dbf, 'Test layer', 2, '#fff');
        expect(layer).toBe(null);
    });

    it('shape2geojson - should return null - dbf undefined', async () => {
        const { shp } = setup();
        const layer = await shape2geoJson(shp, undefined, 'Test layer', 2, '#fff');
        expect(layer).toBe(null);
    });

    it('shape2geojson - should return a FeatureLayer', async () => {
        const { shp, dbf } = setup();
        const layer = await shape2geoJson(shp, dbf, 'Test layer', 1, '#ff0000');

        const { fields, renderer } = layer;
        const { symbol } = renderer;

        const expectedFields = [
            { name: 'ObjectID', alias: 'ObjectID', type: 'esriFieldTypeOID' },
            { name: 'id', alias: 'id', type: 'esriFieldTypeString' },
            { name: 'text', alias: 'text', type: 'esriFieldTypeString' },
        ];

        expect(fields).toMatchObject(expectedFields);
        expect(symbol.color).toBe('#ff0000');
    });

    it('convertLayerListFormat - should convert to layerListFormat', () => {
        const layer = {
            fields: [{ alias: 'f1', type: 'esriFieldTypeString', name: 'f1n' }],
            id: 1,
            title: 'Test layer',
            legendSymbol: null,
        };

        const expected = {
            active: true,
            attribution: '',
            authentication: '',
            fields: [{ label: 'f1', type: 'esriFieldTypeString', name: 'f1n' }],
            id: 1,
            layerGroupName: strings.mapLayers.userLayerGroupName,
            layerOrder: 1,
            layers: 'Test layer',
            maxScale: 0,
            minScale: 0,
            name: 'Test layer',
            legendSymbol: null,
            opacity: 1,
            queryColumnsList: null,
            queryable: false,
            styles: 'default',
            transparent: true,
            type: 'agfs',
            url: null,
            visible: true,
            _source: 'shapefile',
        };

        expect(convertLayerListFormat(layer)).toMatchObject(expected);
    });
});
