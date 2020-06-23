import { getFeatureInfo } from '../featureInfo';

describe('featureInfo', () => {
    it('should return three (3) graphics', async () => {
        fetch.resetMocks();
        fetch.mockResponse(JSON.stringify({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {},
                    properties: {
                        name: 'Helsinki',
                        natcode: '091',
                    },
                },
                {
                    type: 'Feature',
                    geometry: {},
                    properties: {
                        name: 'Espoo',
                        natcode: '049',
                    },
                },
                {
                    type: 'Feature',
                    geometry: {},
                    properties: {
                        name: 'Kauniainen',
                        natcode: '235',
                    },
                },
            ],
        }));

        const graphics = await getFeatureInfo(
            [{
                name: 'Municiaplities',
                attribution: 'source',
                url: 'https://test.example.com',
                layers: 'municipality',
                type: 'wms',
                active: true,
                visible: true,
            }],
            254,
            452,
            {
                xmin: 365000,
                xmax: 366000,
                ymin: 6600000,
                ymax: 6700000,
            },
            600,
            1000,
        );

        const expected = [
            {
                attributes: { name: 'Helsinki', natcode: '091' },
                popupTemplate: {
                    title: 'Municiaplities',
                    content: [
                        {
                            type: 'text',
                            text: 'source',
                        },
                        {
                            type: 'fields',
                            fieldInfos: [
                                {
                                    fieldName: 'name',
                                    label: 'name',
                                    visible: true,
                                },
                                {
                                    fieldName: 'natcode',
                                    label: 'natcode',
                                    visible: true,
                                },
                            ],
                        }],
                },
            },
            {
                attributes: { name: 'Espoo', natcode: '049' },
                popupTemplate: {
                    title: 'Municiaplities',
                    content: [
                        {
                            type: 'text',
                            text: 'source',
                        },
                        {
                            type: 'fields',
                            fieldInfos: [
                                {
                                    fieldName: 'name',
                                    label: 'name',
                                    visible: true,
                                },
                                {
                                    fieldName: 'natcode',
                                    label: 'natcode',
                                    visible: true,
                                },
                            ],
                        }],
                },
            },
            {
                attributes: { name: 'Kauniainen', natcode: '235' },
                popupTemplate: {
                    title: 'Municiaplities',
                    content: [
                        {
                            type: 'text',
                            text: 'source',
                        },
                        {
                            type: 'fields',
                            fieldInfos: [
                                {
                                    fieldName: 'name',
                                    label: 'name',
                                    visible: true,
                                },
                                {
                                    fieldName: 'natcode',
                                    label: 'natcode',
                                    visible: true,
                                },
                            ],
                        }],
                },
            },
        ];

        expect(graphics).toMatchObject(expected);
    });

    it('should return no grarphics, not a WMS -layer', async () => {
        fetch.resetMocks();
        fetch.mockResponse(JSON.stringify({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {},
                    properties: {
                        name: 'Helsinki',
                        natcode: '091',
                    },
                },
            ],
        }));

        const graphics = await getFeatureInfo(
            [{
                name: 'Municiaplities',
                url: 'https://test.example.com',
                layers: 'municipality',
                type: 'wmts',
                active: true,
                visible: true,
            }],
            254,
            452,
            {
                xmin: 365000,
                xmax: 366000,
                ymin: 6600000,
                ymax: 6700000,
            },
            600,
            1000,
        );

        expect(graphics).toMatchObject([]);
    });

    it('should return no grarphics, layer not active', async () => {
        fetch.resetMocks();
        fetch.mockResponse(JSON.stringify({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {},
                    properties: {
                        name: 'Helsinki',
                        natcode: '091',
                    },
                },
            ],
        }));

        const graphics = await getFeatureInfo(
            [{
                name: 'Municiaplities',
                url: 'https://test.example.com',
                layers: 'municipality',
                type: 'wms',
                active: false,
                visible: true,
            }],
            254,
            452,
            {
                xmin: 365000,
                xmax: 366000,
                ymin: 6600000,
                ymax: 6700000,
            },
            600,
            1000,
        );

        expect(graphics).toMatchObject([]);
    });

    it('should return no grarphics, layer not visible', async () => {
        fetch.resetMocks();
        fetch.mockResponse(JSON.stringify({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {},
                    properties: {
                        name: 'Helsinki',
                        natcode: '091',
                    },
                },
            ],
        }));

        const graphics = await getFeatureInfo(
            [{
                name: 'Municiaplities',
                url: 'https://test.example.com',
                layers: 'municipality',
                type: 'wms',
                active: true,
                visible: false,
            }],
            254,
            452,
            {
                xmin: 365000,
                xmax: 366000,
                ymin: 6600000,
                ymax: 6700000,
            },
            600,
            1000,
        );

        expect(graphics).toMatchObject([]);
    });
});
