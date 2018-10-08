import {
    convertEsriGeometryType,
    findGeometryType,
    parseColumnType,
} from '../type';

describe('type tests', () => {
    it('should return ColumnType', () => {
        expect(parseColumnType('esriFieldTypeString'))
            .toEqual('text');
        expect(parseColumnType('esriFieldTypeInteger'))
            .toEqual('number');
    });

    const layer = {
        id: 1,
        geometryType: 'esriGeometryPolyline',
    };

    const layerList = [];
    layerList.push(layer);

    it('should return correct geometry type', () => {
        expect(findGeometryType(1, layerList)).toEqual('esriGeometryPolyline');
    });

    it('should return correct Esri geometry type', () => {
        expect(convertEsriGeometryType('Polygon')).toEqual('esriGeometryPolygon');

        expect(convertEsriGeometryType('point')).toEqual('esriGeometryPoint');
    });
});
