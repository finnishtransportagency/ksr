import { graphicsToEsriJSON } from './../arcFormats';

const graphic = {
    attributes: {
        NAME: 'Feature name',
        ID: 531,
    },
    geometry: null,
    layer: {
        id: 'L1',
        objectIdField: 'ID',
        geometryType: 'point',
        spatialReference: {
            wkid: 3067,
            latestWkid: 3067,
        },
        fields: [
            {
                name: 'NAME',
                type: 'string',
                alias: 'NAME',
                sqlType: undefined,
                domain: undefined,
                defaultValue: null,
            },
            {
                name: 'ID',
                type: 'number',
                alias: 'ID',
                sqlType: undefined,
                domain: undefined,
                defaultValue: null,
            },
        ],
    },
    popupTemplate: null,
    symbol: null,
    clone: () => null,
    getAttribute: a => a,
    setAttribute: a => a,
};

describe('arcFormats', () => {
    it('should return one layer', () => {
        const expectedResult = {
            layers: [{
                id: 'L1',
                objectIdFieldName: 'ID',
                globalIdFieldName: '',
                geometryType: 'point',
                spatialReference: {
                    wkid: 3067,
                    latestWkid: 3067,
                },
                fields: [
                    {
                        name: 'NAME',
                        type: 'string',
                        alias: 'NAME',
                        sqlType: undefined,
                        domain: undefined,
                        defaultValue: null,
                    },
                    {
                        name: 'ID',
                        type: 'number',
                        alias: 'ID',
                        sqlType: undefined,
                        domain: undefined,
                        defaultValue: null,
                    },
                ],
                features: [{
                    attributes: {
                        ID: 531,
                        NAME: 'Feature name',
                    },
                }],
            }],
        };


        const result = graphicsToEsriJSON([graphic]);

        expect(result).toEqual(expectedResult);
    });
});
