import * as fetchMock from '../../../api/geoconvert/getGeoconvert';
import { createGeoconvertParams, createAddressFields } from '../createAddressFields';

describe('createGeoconvertParams', () => {
    it('should work with point', () => {
        const geometry = {
            x: 123,
            y: 123,
        };
        const geometryType = 'point';
        const featureType = 'road';

        const expectedResult = [
            'y=123&x=123&featureType=road',
        ];

        expect(createGeoconvertParams(geometry, geometryType, featureType)).toEqual(expectedResult);
    });

    it('should work with polyline', () => {
        const geometry = {
            paths: [[
                [321, 123],
                [456, 456],
                [564, 564],
                [987, 789],
            ]],
        };
        const geometryType = 'polyline';
        const featureType = 'road';

        const expectedResult = [
            'y=123&x=321&featureType=road',
            'y=789&x=987&featureType=road',
        ];

        expect(createGeoconvertParams(geometry, geometryType, featureType)).toEqual(expectedResult);
    });

    it('should work with multipoint', () => {
        const geometry = {
            points: [
                [123, 123],
                [999, 999],
                [456, 456],
            ],
        };
        const geometryType = 'multipoint';
        const featureType = 'road';

        const expectedResult = [
            'y=123&x=123&featureType=road',
            'y=999&x=999&featureType=road',
            'y=456&x=456&featureType=road',
        ];

        expect(createGeoconvertParams(geometry, geometryType, featureType)).toEqual(expectedResult);
    });
});

describe('createAddressFields', () => {
    it('works with road point', () => {
        fetchMock.fetchGetGeoconvert = jest.fn();
        fetchMock.fetchGetGeoconvert.mockReturnValueOnce({ osoite: 'Address 1' });

        const data = {
            attributes: {},
            geometry: {
                x: 123,
                y: 123,
                type: 'point',
            },
        };
        const featureType = 'road';
        const addressField = 'test_address_field';

        return expect(createAddressFields(data, featureType, addressField))
            .resolves.toEqual({
                ...data,
                attributes: {
                    test_address_field: 'Address 1',
                },
            });
    });

    it('works with road polyline', () => {
        fetchMock.fetchGetGeoconvert = jest.fn();
        fetchMock.fetchGetGeoconvert
            .mockReturnValueOnce({ osoite: 'Address 1' })
            .mockReturnValueOnce({ osoite: 'Address 2' });

        const data = {
            attributes: {},
            geometry: {
                paths: [[
                    [321, 123],
                    [456, 456],
                    [564, 564],
                    [987, 789],
                ]],
                type: 'polyline',
            },
        };
        const featureType = 'road';
        const addressField = 'start_and_endpoint';

        return expect(createAddressFields(data, featureType, addressField))
            .resolves.toEqual({
                ...data,
                attributes: {
                    start_and_endpoint: 'Address 1, Address 2',
                },
            });
    });

    it('works with road multipoint', () => {
        fetchMock.fetchGetGeoconvert = jest.fn();
        fetchMock.fetchGetGeoconvert
            .mockReturnValueOnce({ osoite: 'Address 1' })
            .mockReturnValueOnce({ osoite: 'Address 2' })
            .mockReturnValueOnce({ osoite: 'Address 3' });

        const data = {
            attributes: {},
            geometry: {
                points: [
                    [123, 123],
                    [123, 123],
                    [123, 123],
                ],
                type: 'multipoint',
            },
        };
        const featureType = 'road';
        const addressField = 'address_fields';

        return expect(createAddressFields(data, featureType, addressField))
            .resolves.toEqual({
                ...data,
                attributes: {
                    address_fields: 'Address 1, Address 2, Address 3',
                },
            });
    });

    it('works with railway point', () => {
        fetchMock.fetchGetGeoconvert
            .mockReturnValueOnce({ kunta_nimi: 'Municipality', urakka_nimi: 'Contract' });

        const data = {
            attributes: {},
            geometry: {
                x: 123,
                y: 123,
                type: 'point',
            },
        };
        const featureType = 'railway';
        const addressField = 'test_address_field';

        return expect(createAddressFields(data, featureType, addressField))
            .resolves.toEqual({
                ...data,
                attributes: {
                    test_address_field: 'Municipality - Contract',
                },
            });
    });

    it('works with railway polyline', () => {
        fetchMock.fetchGetGeoconvert
            .mockReturnValueOnce({ kunta_nimi: 'Municipality 1', urakka_nimi: 'Contract 1' })
            .mockReturnValueOnce({ kunta_nimi: 'Municipality 2', urakka_nimi: 'Contract 2' });

        const data = {
            attributes: {},
            geometry: {
                paths: [[
                    [321, 123],
                    [456, 456],
                    [564, 564],
                    [987, 789],
                ]],
                type: 'polyline',
            },
        };
        const featureType = 'railway';
        const addressField = 'start_and_endpoint';

        return expect(createAddressFields(data, featureType, addressField))
            .resolves.toEqual({
                ...data,
                attributes: {
                    start_and_endpoint: 'Municipality 1 - Contract 1, Municipality 2 - Contract 2',
                },
            });
    });

    it('works with railway multipoint', () => {
        fetchMock.fetchGetGeoconvert
            .mockReturnValueOnce({ kunta_nimi: 'Municipality 1', urakka_nimi: 'Contract 1' })
            .mockReturnValueOnce({ kunta_nimi: 'Municipality 2', urakka_nimi: 'Contract 2' })
            .mockReturnValueOnce({ kunta_nimi: 'Municipality 3', urakka_nimi: 'Contract 3' });

        const data = {
            attributes: {},
            geometry: {
                points: [
                    [123, 123],
                    [123, 123],
                    [123, 123],
                ],
                type: 'multipoint',
            },
        };
        const featureType = 'railway';
        const addressField = 'test_address_field';

        return expect(createAddressFields(data, featureType, addressField))
            .resolves.toEqual({
                ...data,
                attributes: {
                    test_address_field: 'Municipality 1 - Contract 1, Municipality 2 - Contract 2, Municipality 3 - Contract 3',
                },
            });
    });
});
