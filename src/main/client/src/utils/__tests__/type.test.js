import { convertEsriGeometryType, dataType, findGeometryType, parseColumnType, parseGeometryType } from '../type';

describe('type tests', () => {
    it('should return ColumnType', () => {
        expect(parseColumnType('esriFieldTypeString'))
            .toEqual('text');
        expect(parseColumnType('esriFieldTypeInteger'))
            .toEqual('number');
    });

    it('should return correct geometry', () => {
        let geometry = {
            type: 'polygon',
            rings: [
                [10, 10],
                [20, 20],
            ],
        };

        let expectedSymbol = [
            [10, 10], [20, 20],
        ];

        expect(parseGeometryType(geometry))
            .toEqual(expect.objectContaining(expectedSymbol));

        geometry = { type: 'point', x: 10, y: 20 };

        expectedSymbol = {
            x: 10,
            y: 20,
        };
        expect(parseGeometryType(geometry))
            .toEqual(expect.objectContaining(expectedSymbol));

        geometry = {
            type: 'polyline',
            paths: [
                [-95.9899452281111, 38.1345878074741],
                [-95.9898896947778, 38.1344644074744],
                [-95.9899164947778, 38.1343866074744],
            ],
        };

        expectedSymbol =
            [
                [-95.9899452281111, 38.1345878074741],
                [-95.9898896947778, 38.1344644074744],
                [-95.9899164947778, 38.1343866074744],
            ];
        expect(parseGeometryType(geometry))
            .toEqual(expect.objectContaining(expectedSymbol));
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

    it('should return correct data type', () => {
        expect(dataType('text')).toEqual('esriFieldTypeString');

        expect(dataType(123)).toEqual('esriFieldTypeInteger');

        expect(dataType(new Date())).toEqual('esriFieldTypeDate');
    });
});
