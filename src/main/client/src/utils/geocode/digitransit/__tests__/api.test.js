/* eslint-disable quotes */
import { fetchAddresses } from '../api';
import { convert } from '../../../geojson';

jest.mock('../../../geojson');

const successResponse = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[24.94866371154785,60.167518007518304]},"properties":{"id":"point:100","confidence":1,"label":"Helsinki, Esplanadi"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[24.94192600250244,60.17089096333529]},"properties":{"id":"point:123","confidence":0.98,"label":"Helsinki, rautatieasema"}}]}';

const emptyResponse = '{"type":"FeatureCollection","features":[]}';

const errorResponse = '';


describe.skip('digitransit - api', () => {
    beforeAll(() => {
        convert.mockReturnValue({ x: 1, y: 2, spatialReference: { wkid: 3067 } });
    });

    it('should fetchAddresses - non empty response', async () => {
        fetch.mockResponseOnce(successResponse);

        const expected = [
            {
                isCollection: false,
                text: 'Helsinki, Esplanadi',
                address: 'Helsinki, Esplanadi',
                magicKey: 'point:100',
                location: { x: 1, y: 2, spatialReference: { wkid: 3067 } },
                score: 100,
            },
            {
                isCollection: false,
                text: 'Helsinki, rautatieasema',
                address: 'Helsinki, rautatieasema',
                magicKey: 'point:123',
                location: { x: 1, y: 2, spatialReference: { wkid: 3067 } },
                score: 98,
            },
        ];

        const response = await fetchAddresses('Helsinki', 2);
        expect(response).toMatchObject(expected);
    });

    it('should fetchAddresses - empty response', async () => {
        fetch.mockResponseOnce(emptyResponse);

        const response = await fetchAddresses('Turku', 1);
        expect(response).toMatchObject([]);
    });

    it('should fetchAddresses - invalid response', async () => {
        fetch.mockResponseOnce(errorResponse);
        const consoleMock = jest.fn();

        window.console.error = consoleMock;

        const response = await fetchAddresses('Tampere', 1);
        expect(response).toMatchObject([]);
        expect(consoleMock.mock.calls.length).toBe(1);
    });
});
