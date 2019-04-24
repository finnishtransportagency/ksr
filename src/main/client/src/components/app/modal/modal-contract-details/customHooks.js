// @flow
import { useEffect, useState } from 'react';
import { nestedVal } from '../../../../utils/nestedValue';
import strings from '../../../../translations';
import { getAttribute, getFeatureAttributes, addDetailToContract } from '../../../../utils/contracts/contracts';
import save from '../../../../utils/saveFeatureData';
import store from '../../../../store';
import { getContractDocumentUrl } from '../../../../utils/contracts/contractDocument';

/**
 * Updates state with new detail list to be shown for found layers and features.
 *
 * @param {Object[]} contractDetails List containing contract feature details.
 * @param {Object[]} layerList Layer list in redux.
 * @param {any[]} effectListeners List of items that useEffect listens to (contractDetails).
 *
 * @returns {Object[]} List of found layers and features.
 */
export const useDetailList = (
    contractDetails: Object[],
    layerList: Object[],
    effectListeners: any[],
): Object[] => {
    const [detailList, setDetailList] = useState([]);

    useEffect(() => {
        setDetailList(contractDetails
            .map((layerDetail) => {
                const layer = layerList.find(l => layerDetail.id === l.id);

                if (layer) {
                    const objectIdFieldName = nestedVal(
                        layer.fields && layer.fields.find(a => a.type === 'esriFieldTypeOID'),
                        ['name'],
                    );
                    const createPermission = nestedVal(
                        layer,
                        ['layerPermission', 'createLayer'],
                        false,
                    );
                    const editPermission = nestedVal(
                        layer,
                        ['layerPermission', 'updateLayer'],
                        false,
                    );

                    const features = layerDetail.features
                        ? layerDetail.features
                            .map(feature => ({
                                id: nestedVal(feature, ['attributes', layer.contractIdField], ''),
                                objectId: nestedVal(feature, ['attributes', objectIdFieldName], ''),
                                description: nestedVal(
                                    feature,
                                    ['attributes', layer.contractDescriptionField],
                                    '',
                                ),
                                alfrescoUrl: layer.alfrescoLinkField
                                    ? getContractDocumentUrl(
                                        'alfresco',
                                        layer.alfrescoLinkField,
                                        feature.attributes,
                                    )
                                    : '',
                                caseManagementUrl: layer.caseManagementLinkField
                                    ? getContractDocumentUrl(
                                        'caseManagement',
                                        layer.caseManagementLinkField,
                                        feature.attributes,
                                    )
                                    : '',
                            }))
                        : [];

                    return {
                        id: layerDetail.id,
                        name: layerDetail.name,
                        features,
                        createPermission,
                        editPermission,
                    };
                }

                return {
                    id: null,
                    name: null,
                    features: [],
                };
            }));
    }, [...effectListeners]);

    return detailList;
};

/**
 * Updates state with found feature's attributes.
 *
 * @param {Object[]} contractDetails List containing contract feature details.
 * @param {Object[] }layerList Layer list in redux.
 * @param {string} activeView Currenty active view in modal.
 * @param {Object} activeFeature Active feature's details.
 * @param {any[]} effectListeners List of items that useEffect listens to (activeView).
 *
 * @returns {Object[]} Single feature's attributes.
 */
export const useFeatureAttributes = (
    contractDetails: Object[],
    layerList: Object[],
    activeView: string,
    activeFeature: Object,
    effectListeners: any[],
): Object[] => {
    const [featureAttributes, setFeatureAttributes] = useState([]);

    useEffect(() => {
        if (activeView === 'singleFeatureDetails' || activeView === 'editFeature') {
            const layer: Object = layerList.find(l => activeFeature.layerId === l.id);
            const attributes: Object[] = getFeatureAttributes(
                layer,
                contractDetails,
                activeFeature,
            );
            setFeatureAttributes((attributes
                .map(attribute => getAttribute(layer, attribute, activeView === 'editFeature')): Object[]));
        } else {
            setFeatureAttributes([]);
        }
    }, [...effectListeners]);

    return featureAttributes;
};

/**
 * Updates state with new modal title.
 *
 * @param {string} activeView Currently active view in modal.
 * @param {Object} activeFeature Active feature's details.
 * @param {any[]} effectListeners List of items that useEffect listens to (activeView).
 *
 * @returns {string} Modal's title.
 */
export const useTitle = (
    activeView: string,
    activeFeature: Object,
    effectListeners: any[],
): string => {
    const [title, setTitle] = useState('');
    useEffect(() => {
        switch (activeView) {
            case 'contractDetails':
                return setTitle(strings.modalContractDetails.listView.title);
            case 'singleFeatureDetails':
                return setTitle(`${activeFeature.layerName} ${activeFeature.featureId}`);
            case 'chooseDetailLayer':
                return setTitle(strings.modalContractDetails.chooseLayer);
            case 'addNewDetail':
                return setTitle(strings.modalContractDetails.newDetail.title);
            case 'editFeature':
                return setTitle(strings.modalContractDetails.editFeature.title);
            default:
                return setTitle('');
        }
    }, [...effectListeners]);

    return title;
};

/**
 * Updates state with new cancel text.
 *
 * @param {string} activeView Currently active view in modal.
 * @param {string} source Source where modal was opened from.
 * @param {any[]} effectListeners List of items that useEffect listens to (activeView).
 *
 * @returns {string} Modal's cancel text.
 */
export const useCancelText = (
    activeView: string,
    source: string,
    effectListeners: any[],
): string => {
    const [cancelText, setCancelText] = useState(strings.modalContractDetails.cancelText);

    useEffect(() => {
        if (activeView === 'contractDetails' && source !== 'contractModal') {
            setCancelText(strings.modalContractDetails.cancelText);
        } else {
            setCancelText(strings.modalContractDetails.backText);
        }
    }, [...effectListeners]);

    return cancelText;
};

/**
 * Updates state with new modal submit values based on active view.
 *
 * @param {Object[]} contractDetails List containing contract feature details.
 * @param {string} activeView Currently active view in modal.
 * @param {Object} contractLayer Active contract layer in modal.
 * @param {number} contractObjectId Current contract's object id used in feature save.
 * @param {Object[]} detailLayers Detail layers connected to contract layer.
 * @param {Function} setActiveView Set active view after submit.
 * @param {Object} activeDetailLayer Layer that is currently active on modal form.
 * @param {Function} setRefreshList Used to refresh contract list if new detail added.
 * @param {Object} formOptions Contain's form's field data and whether submit is disabled or not.
 * @param {Function} setFormOptions Used to set submit to disabled while querying feature save.
 * @param {string} activeAdmin Currently active layer's Id in admin mode.
 * @param {Object[]} detailList List containing contract and detail layers.
 * @param {Object} activeFeature Active feature's details.
 * @param effectListeners List of items that useEffect listens to
 * (contractDetails, activeView, detailLayers, formOptions).
 */
export const useModalSubmit = (
    contractDetails: Object[],
    activeView: string,
    contractLayer: Object,
    contractObjectId: number,
    detailLayers: Object[],
    setActiveView: (activeView: string) => void,
    activeDetailLayer: Object,
    setRefreshList: (refreshList: boolean) => void,
    formOptions: { editedFields: Object, submitDisabled: boolean },
    setFormOptions: (formOptions: Object) => void,
    activeAdmin: string,
    detailList: Object[],
    activeFeature: Object,
    effectListeners: any[],
) => {
    const [modalSubmit, setModalSubmit] = useState([]);

    useEffect(() => {
        switch (activeView) {
            case 'contractDetails':
                if (detailList.some(layer => layer.id === activeAdmin)) {
                    setModalSubmit([{
                        text: strings.modalContractDetails.addNewDetail,
                        handleSubmit: () => setActiveView('chooseDetailLayer'),
                        disabled: !detailLayers.length,
                        toggleModal: false,
                    }]);
                }
                break;
            case 'singleFeatureDetails':
                setModalSubmit([]);
                break;
            case 'chooseDetailLayer':
                setModalSubmit([]);
                break;
            case 'addNewDetail':
                setModalSubmit([{
                    text: strings.modalContractDetails.newDetail.submit,
                    handleSubmit: async () => {
                        setFormOptions({ ...formOptions, submitDisabled: true });
                        const detailAdded = await addDetailToContract(
                            activeDetailLayer,
                            contractLayer,
                            contractObjectId,
                            formOptions.editedFields,
                        );

                        setRefreshList(detailAdded);
                        setActiveView('contractDetails');
                    },
                    disabled: formOptions.submitDisabled,
                    toggleModal: false,
                }]);
                break;
            case 'editFeature':
                setModalSubmit([{
                    text: strings.modalContractDetails.editFeature.submit,
                    handleSubmit: async () => {
                        setFormOptions({ ...formOptions, submitDisabled: true });
                        const objectIdFieldName = nestedVal(
                            activeDetailLayer.fields.find(field => field.type === 'esriFieldTypeOID'),
                            ['name'],
                        );
                        const updateRes = await save.saveData(
                            'update',
                            store.getState().map.mapView.view,
                            nestedVal(activeDetailLayer, ['id']),
                            [{
                                attributes: { ...formOptions.editedFields },
                            }],
                            objectIdFieldName,
                            activeFeature.objectId,
                        );

                        setRefreshList(!!nestedVal(updateRes, ['features', 'length']));
                        setActiveView('contractDetails');
                    },
                    disabled: formOptions.submitDisabled,
                    toggleModal: false,
                }]);
                break;
            default:
                setModalSubmit([]);
                break;
        }
    }, [...effectListeners]);

    return modalSubmit;
};
