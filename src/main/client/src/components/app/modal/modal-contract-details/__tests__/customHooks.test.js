import { testHook, cleanup } from 'react-testing-library';
import { useCancelText, useDetailList, useFeatureAttributes, useTitle } from '../customHooks';
import strings from '../../../../../translations';

afterEach(cleanup);

describe('Modal Contract Details - Custom Hooks', () => {
    test('useTitle - Changes title', () => {
        let title;
        let activeView;
        let activeFeature;

        testHook(() => {
            activeView = 'contractDetails';
            activeFeature = { layerName: null, layerId: null, featureId: null };

            title = useTitle(activeView, activeFeature, [activeView]);
        });
        expect(title).toBe(strings.modalContractDetails.listView.title);

        testHook(() => {
            activeView = 'singleFeatureDetails';
            activeFeature = { layerName: 'Layer 1', layerId: null, featureId: 123 };

            title = useTitle(activeView, activeFeature, [activeView]);
        });
        expect(title).toBe('Layer 1 123');

        testHook(() => {
            activeView = 'test123';
            activeFeature = { layerName: null, layerId: null, featureId: null };

            title = useTitle(activeView, activeFeature, [activeView]);
        });
        expect(title).toBe('');
    });

    test('useCancelText - Changes cancel button text', () => {
        let cancelText;
        let activeView;
        let source;

        testHook(() => {
            activeView = 'contractDetails';
            source = 'contractModal';

            cancelText = useCancelText(activeView, source, [activeView]);
        });
        expect(cancelText).toBe(strings.modalContractDetails.backText);

        testHook(() => {
            activeView = 'contractDetails';
            source = 'table';

            cancelText = useCancelText(activeView, source, [activeView]);
        });
        expect(cancelText).toBe(strings.modalContractDetails.cancelText);
    });

    test('useDetailList - Should populate detail list with feature Id and description', () => {
        let detailList;
        let contractDetails;
        const layerList = [
            {
                name: 'Layer 1',
                id: '123',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
            },
            {
                name: 'Layer 2',
                id: '456',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
            },
            {
                name: 'Layer 3',
                id: '789',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
            },
        ];

        const expectedValue = [{
            id: '123',
            name: 'Layer 1',
            features: [
                { id: '1', description: 'Description 1' },
                { id: '10', description: 'Description 2' },
            ],
        }, {
            id: '789',
            name: 'Layer 3',
            features: [
                { id: '123', description: 'Test Description' },
            ],
        }];

        testHook(() => {
            contractDetails = [{
                id: '123',
                name: 'Layer 1',
                features: [
                    { attributes: { idField: '1', descField: 'Description 1' } },
                    { attributes: { idField: '10', descField: 'Description 2' } },
                ],
            },
            {
                id: '789',
                name: 'Layer 3',
                features: [
                    { attributes: { idField: '123', descField: 'Test Description' } },
                ],
            },
            ];

            detailList = useDetailList(contractDetails, layerList, [contractDetails]);
        });
        expect(detailList).toEqual(expectedValue);
    });

    test('useFeatureAttributes - not single feature view - Should return empty list', () => {
        let featureAttributes;
        let contractDetails;
        let activeView;
        let activeFeature;
        const layerList = [
            {
                name: 'Layer 1',
                id: '123',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
            },
            {
                name: 'Layer 2',
                id: '456',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
            },
            {
                name: 'Layer 3',
                id: '789',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
            },
        ];

        const expectedValue = [];

        testHook(() => {
            activeView = 'contractDetails';

            featureAttributes = useFeatureAttributes(
                contractDetails,
                layerList,
                activeView,
                activeFeature,
                [activeView],
            );
        });
        expect(featureAttributes).toEqual(expectedValue);

        testHook(() => {
            activeView = '';

            featureAttributes = useFeatureAttributes(
                contractDetails,
                layerList,
                activeView,
                activeFeature,
                [activeView],
            );
        });
        expect(featureAttributes).toEqual(expectedValue);
    });

    test('useFeatureAttributes - single feature view - Should return list of attributes', () => {
        let featureAttributes;
        const contractDetails = [{
            id: '123',
            name: 'Layer 1',
            features: [
                { attributes: { idField: 123, name2: 'Value 2', name3: 1000 } },
            ],
        }];
        const activeView = 'singleFeatureDetails';
        const activeFeature = { layerName: 'Layer 1', layerId: '123', featureId: 123 };
        const layerList = [
            {
                name: 'Layer 1',
                id: '123',
                contractIdField: 'idField',
                contractDescriptionField: 'field2',
                fields: [
                    { name: 'idField', type: 'esriFieldTypeOID' },
                    { name: 'name2', type: 'esriFieldTypeString' },
                    { name: 'name3', type: 'esriFieldTypeInteger' },
                ],
            },
        ];

        const expectedValue = [
            { name: 'idField', value: null },
            { name: 'name2', value: 'Value 2' },
            { name: 'name3', value: 1000 },
        ];

        testHook(() => {
            featureAttributes = useFeatureAttributes(
                contractDetails,
                layerList,
                activeView,
                activeFeature,
                [activeView],
            );
        });
        expect(featureAttributes).toEqual(expectedValue);
    });
});
