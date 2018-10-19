import * as geoconvert from '../geoconvert/createAddressFields';
import save from '../saveFeatureData';

describe('saveFeatureData', () => {
    it('featureDataToParams - should return null if null given', () => {
        expect(save.featureDataToParams(null)).toBe(null);
    });

    it('featureDataToParams - should return correct data', () => {
        const inputFeatures = [{ attributes: { a: 1, b: '2' }, geometry: {} }];
        const form = save.featureDataToParams(inputFeatures);

        expect(form.get('f')).toBe('json');
        expect(JSON.parse(form.get('features'))).toMatchObject(inputFeatures);
    });

    it('findMatchingLayer - should return null - invalid input', () => {
        expect(save.findMatchingLayer({ allLayerViews: [] }, null)).toBe(null);
        expect(save.findMatchingLayer({ allLayerViews: [] }, undefined)).toBe(null);
        expect(save.findMatchingLayer(null, '1')).toBe(null);
        expect(save.findMatchingLayer(undefined, '2')).toBe(null);
        expect(save.findMatchingLayer({ a: 1 }, '1')).toBe(null);
    });

    it('findMatchingLayer - should not find a matching layer', () => {
        const view = { allLayerViews: [{ layer: { id: '1' } }, { layer: { id: '2' } }] };

        expect(save.findMatchingLayer(view, '3')).toBe(undefined);
        expect(save.findMatchingLayer(view, '0')).toBe(undefined);
    });

    it('findMatchingLayer - should return corresponding layer', () => {
        const view = { allLayerViews: [{ layer: { id: '1' } }, { layer: { id: '2' } }] };

        expect(save.findMatchingLayer(view, '2')).toMatchObject({ layer: { id: '2' } });
    });

    it('handleSaveResponse - invalid response - should not refresh layer', () => {
        const layer = { refresh: jest.fn() };
        save.handleSaveResponse({ addResults: 1 }, layer);
        expect(layer.refresh.mock.calls.length).toBe(0);
    });

    it('handleSaveResponse - invalid layer-parameter - should not refresh layer', () => {
        expect(save.handleSaveResponse({ addResults: 1 }, null)).toBe(undefined);
    });

    it('handleSaveResponse - invalid parameters - should not refresh layer', () => {
        const layer1 = { refresh: jest.fn() };
        save.handleSaveResponse(null, null);
        expect(layer1.refresh.mock.calls.length).toBe(0);
    });

    it('handleSaveResponse - one successful - should refresh layer', () => {
        const layer = { refresh: jest.fn() };
        const response = {
            addResults: [
                { success: false },
                { success: true },
                { success: false },
            ],
        };
        save.handleSaveResponse(response, layer);
        expect(layer.refresh.mock.calls.length).toBe(1);
    });

    it('handleSaveResponse - not success - should not refresh layer', () => {
        const layer = { refresh: jest.fn() };
        const response = {
            addResults: [
                { success: false },
                { success: false },
                { success: false },
            ],
        };
        save.handleSaveResponse(response, layer);
        expect(layer.refresh.mock.calls.length).toBe(0);
    });

    it('handleSaveResponse - all success - should refresh layer', () => {
        const layer = { refresh: jest.fn() };
        const response = {
            addResults: [
                { success: true },
                { success: true },
                { success: true },
            ],
        };
        save.handleSaveResponse(response, layer);
        expect(layer.refresh.mock.calls.length).toBe(1);
    });

    it('handleDeleteResponse - invalid response - should not refresh layer', () => {
        const layer = { refresh: jest.fn() };
        save.handleDeleteResponse({ deleteResults: 1 }, layer);
        expect(layer.refresh.mock.calls.length).toBe(0);
    });

    it('handleDeleteResponse - invalid layer-parameter - should not refresh layer', () => {
        expect(save.handleDeleteResponse({ deleteResults: 1 }, null)).toBe(undefined);
    });

    it('handleDeleteResponse - invalid parameters - should not refresh layer', () => {
        const layer1 = { refresh: jest.fn() };
        save.handleDeleteResponse(null, null);
        expect(layer1.refresh.mock.calls.length).toBe(0);
    });

    it('handleDeleteResponse - one successful - should refresh layer', () => {
        const layer = { refresh: jest.fn() };
        const response = {
            deleteResults: [
                { success: false },
                { success: true },
                { success: false },
            ],
        };
        save.handleDeleteResponse(response, layer);
        expect(layer.refresh.mock.calls.length).toBe(1);
    });

    it('handleDeleteResponse - not success - should not refresh layer', () => {
        const layer = { refresh: jest.fn() };
        const response = {
            deleteResults: [
                { success: false },
                { success: false },
                { success: false },
            ],
        };
        save.handleDeleteResponse(response, layer);
        expect(layer.refresh.mock.calls.length).toBe(0);
    });

    it('handleDeleteResponse - all success - should refresh layer', () => {
        const layer = { refresh: jest.fn() };
        const response = {
            deleteResults: [
                { success: true },
                { success: true },
                { success: true },
            ],
        };
        save.handleDeleteResponse(response, layer);
        expect(layer.refresh.mock.calls.length).toBe(1);
    });

    it('formatToEsriCompliant - should return undefined', () => {
        expect(save.formatToEsriCompliant(null)).toBe(null);
        expect(save.formatToEsriCompliant(undefined)).toBe(undefined);
    });

    it('formatToEsriCompliant - should return correct object', () => {
        expect(save.formatToEsriCompliant({})).toMatchObject({ attributes: {} });
        expect(save.formatToEsriCompliant({
            a: 1,
            b: 2,
            geometry: 3,
        })).toMatchObject({ attributes: { a: 1, b: 2 }, geometry: 3 });
    });

    it('saveEditedFeatureData - should invoke saveFeatureData -method', () => {
        save.saveData = jest.fn(); // eslint-disable-line import/no-named-as-default-member
        geoconvert.createAddressFields = jest.fn();

        const editedData = [
            {
                data: [
                    {
                        '1/OBJECTID': 1,
                        '1/b': 2,
                        '1/e': 4,
                        _c: 3,
                        geometry: 3,
                        _edited: [{ title: '1/b' }],
                    },
                ],
                id: '1',
                _idFieldName: 'OBJECTID',
                columns: [{ accessor: '1/OBJECTID', Header: 'OBJECTID' }],
            },
        ];

        return save.saveEditedFeatureData({}, editedData, 'road', 'test_address_field')
            .then(() => {
                expect(geoconvert.createAddressFields.mock.calls.length).toBe(1);

                expect(geoconvert.createAddressFields.mock.calls[0][0])
                    .toMatchObject({ attributes: { '1/OBJECTID': 1, '1/b': 2 }, geometry: 3 });
                expect(geoconvert.createAddressFields.mock.calls[0][1]).toBe('road');
                expect(geoconvert.createAddressFields.mock.calls[0][2]).toBe('test_address_field');

                expect(save.saveData.mock.calls.length).toBe(1);
            });
    });
});
