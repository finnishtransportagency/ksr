import { testHook, cleanup } from 'react-testing-library';
import {
    useCancelText, useDetailList, useFeatureAttributes, useTitle, useModalSubmit,
} from '../customHooks';
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
                alfrescoLinkField: 'alfrescoLinkField',
                caseManagementLinkField: 'caseManagementLinkField',
                fields: [
                    { name: 'objectId', label: 'objectId', type: 'esriFieldTypeOID' },
                ],
            },
            {
                name: 'Layer 2',
                id: '456',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
                alfrescoLinkField: null,
                caseManagementLinkField: null,
                fields: [
                    { name: 'objectId', label: 'objectId', type: 'esriFieldTypeOID' },
                ],
            },
            {
                name: 'Layer 3',
                id: '789',
                contractIdField: 'idField',
                contractDescriptionField: 'descField',
                alfrescoLinkField: null,
                caseManagementLinkField: null,
                fields: [
                    { name: 'objectId', label: 'objectId', type: 'esriFieldTypeOID' },
                ],
            },
        ];

        const expectedValue = [{
            id: '123',
            name: 'Layer 1',
            features: [
                {
                    id: '1',
                    description: 'Description 1',
                    objectId: 1,
                    alfrescoUrl: '/api/contract-document?documentType=alfresco&searchValue=123',
                    caseManagementUrl: '/api/contract-document?documentType=caseManagement&searchValue=456',
                },
                {
                    id: '10',
                    description: 'Description 2',
                    objectId: 2,
                    alfrescoUrl: '/api/contract-document?documentType=alfresco&searchValue=789',
                    caseManagementUrl: null,
                },
            ],
        }, {
            id: '789',
            name: 'Layer 3',
            features: [
                {
                    id: '123', description: 'Test Description', objectId: 1, alfrescoUrl: '', caseManagementUrl: '',
                },
            ],
        }];

        testHook(() => {
            contractDetails = [{
                id: '123',
                name: 'Layer 1',
                features: [
                    {
                        attributes: {
                            objectId: 1, idField: '1', descField: 'Description 1', alfrescoLinkField: '123', caseManagementLinkField: '456',
                        },
                    },
                    {
                        attributes: {
                            objectId: 2, idField: '10', descField: 'Description 2', alfrescoLinkField: '789',
                        },
                    },
                ],
            },
            {
                id: '789',
                name: 'Layer 3',
                features: [
                    { attributes: { objectId: 1, idField: '123', descField: 'Test Description' } },
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
                    { name: 'idField', label: 'idField', type: 'esriFieldTypeString' },
                    { name: 'name2', label: 'label2', type: 'esriFieldTypeString' },
                    { name: 'name3', label: 'label3', type: 'esriFieldTypeInteger' },
                ],
            },
        ];

        const expectedValue = [
            {
                name: 'idField', label: 'idField', value: '123', hidden: false,
            },
            {
                name: 'name2', label: 'label2', value: 'Value 2', hidden: false,
            },
            {
                name: 'name3', label: 'label3', value: 1000, hidden: false,
            },
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

    test('useModalSubmit - should return correct modalSubmit values', () => {
        let modalSubmit;
        let activeView;
        let formOptions;
        let permission;
        let detailLayers;
        const contractDetails = [];
        const contractLayer = { id: 123 };
        const contractObjectId = 123;
        const setActiveView = jest.fn();
        const activeDetailLayer = { id: 456 };
        const setRefreshList = jest.fn();
        const setFormOptions = jest.fn();
        const activeFeature = { layerName: null, layerId: null, featureId: null };

        activeView = '';
        testHook(() => {
            modalSubmit = useModalSubmit(
                contractDetails,
                activeView,
                contractLayer,
                contractObjectId,
                detailLayers,
                setActiveView,
                activeDetailLayer,
                setRefreshList,
                formOptions,
                setFormOptions,
                permission,
                activeFeature,
                [contractDetails, activeView, detailLayers, formOptions],
            );
        });
        expect(modalSubmit).toEqual([]);

        activeView = 'singleFeatureDetails';
        testHook(() => {
            modalSubmit = useModalSubmit(
                contractDetails,
                activeView,
                contractLayer,
                contractObjectId,
                detailLayers,
                setActiveView,
                activeDetailLayer,
                setRefreshList,
                formOptions,
                setFormOptions,
                permission,
                activeFeature,
                [contractDetails, activeView, detailLayers, formOptions],
            );
        });
        expect(modalSubmit).toEqual([]);

        activeView = 'chooseDetailLayer';
        testHook(() => {
            modalSubmit = useModalSubmit(
                contractDetails,
                activeView,
                contractLayer,
                contractObjectId,
                detailLayers,
                setActiveView,
                activeDetailLayer,
                setRefreshList,
                formOptions,
                setFormOptions,
                permission,
                activeFeature,
                [contractDetails, activeView, detailLayers, formOptions],
            );
        });
        expect(modalSubmit).toEqual([]);

        activeView = 'contractDetails';
        permission = { create: true, edit: true };
        detailLayers = [{ id: 123 }];
        testHook(() => {
            modalSubmit = useModalSubmit(
                contractDetails,
                activeView,
                contractLayer,
                contractObjectId,
                detailLayers,
                setActiveView,
                activeDetailLayer,
                setRefreshList,
                formOptions,
                setFormOptions,
                permission,
                activeFeature,
                [contractDetails, activeView, detailLayers, formOptions],
            );
        });
        expect(modalSubmit).toEqual([{
            disabled: false,
            handleSubmit: expect.any(Function),
            text: strings.modalContractDetails.addNewDetail,
            toggleModal: false,
        }]);

        activeView = 'addNewDetail';
        formOptions = { editedFields: { id: 123 }, submitDisabled: false };
        testHook(() => {
            modalSubmit = useModalSubmit(
                contractDetails,
                activeView,
                contractLayer,
                contractObjectId,
                detailLayers,
                setActiveView,
                activeDetailLayer,
                setRefreshList,
                formOptions,
                setFormOptions,
                permission,
                activeFeature,
                [contractDetails, activeView, detailLayers, formOptions],
            );
        });
        expect(modalSubmit).toEqual([{
            disabled: false,
            handleSubmit: expect.any(Function),
            text: strings.modalContractDetails.newDetail.submit,
            toggleModal: false,
        }]);
    });
});
