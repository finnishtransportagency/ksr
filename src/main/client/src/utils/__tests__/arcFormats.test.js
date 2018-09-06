import { graphicsToEsriJSON } from './../arcFormats';

const graphic = {
    attributes: {
        NAME: 'Feature name',
        ID: 531,
    },
    geometry: {},
    layer: {
        id: 'L1',
        objectIdField: 'ID',
        geometryType: 'point',
        spatialReference: {
            wkid: 3067,
            latestWkid: 3067,
        },
        title: 'TITLE',
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
                source: 'select',
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
                title: 'TITLE',
                features: [{
                    attributes: {
                        ID: 531,
                        NAME: 'Feature name',
                    },
                    geometry: {},
                }],
            }],
        };


        const result = graphicsToEsriJSON([graphic]);

        expect(result).toEqual(expectedResult);
    });
});
