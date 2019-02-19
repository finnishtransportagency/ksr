// @flow
import { useEffect, useState } from 'react';
import { nestedVal } from '../../../../utils/nestedValue';
import strings from '../../../../translations';
import { getAttribute, getFeatureAttributes } from '../../../../utils/contracts/contracts';

/**
 * Updates state with new detail list to be shown for found layers and features.
 *
 * @param {Object[]} contractDetails List containing contract feature details.
 * @param {Object[]} layerList Layer list in redux.
 * @param {any[]} effectListeners List of items that useEffect listens to (contractDetails).
 *
 * @returns {Object[]} List of found layers and features.
 */
export function useDetailList(
    contractDetails: Object[],
    layerList: Object[],
    effectListeners: any[],
): Object[] {
    const [detailList, setDetailList] = useState([]);

    useEffect(() => {
        setDetailList(contractDetails
            .map((layerDetail) => {
                const idField = nestedVal(
                    layerList.find(layer => layerDetail.id === layer.id),
                    ['contractIdField'],
                );

                const descriptionField = nestedVal(
                    layerList.find(layer => layerDetail.id === layer.id),
                    ['contractDescriptionField'],
                );

                const features = layerDetail.features
                    ? layerDetail.features
                        .map(feature => ({
                            id: nestedVal(feature, ['attributes', idField], ''),
                            description: nestedVal(feature, ['attributes', descriptionField], ''),
                        }))
                    : [];

                return {
                    id: layerDetail.id,
                    name: layerDetail.name,
                    features,
                };
            }));
    }, [...effectListeners]);

    return detailList;
}

/**
 * Updates state with found feature's attributes.
 *
 * @param contractDetails List containing contract feature details.
 * @param layerList Layer list in redux.
 * @param activeView Currenty active view in modal.
 * @param activeFeature Active feature's layer name and feature Id.
 * @param {any[]} effectListeners List of items that useEffect listens to (activeView).
 *
 * @returns {Object[]} Single feature's attributes.
 */
export function useFeatureAttributes(
    contractDetails: Object[],
    layerList: Object[],
    activeView: string,
    activeFeature: Object,
    effectListeners: any[],
): Object[] {
    const [featureAttributes, setFeatureAttributes] = useState([]);

    useEffect(() => {
        if (activeView === 'singleFeatureDetails') {
            const layer: Object = layerList.find(l => activeFeature.layerId === l.id);
            const attributes: Object[] = getFeatureAttributes(
                layer,
                contractDetails,
                activeFeature,
            );
            setFeatureAttributes((attributes
                .map(attribute => getAttribute(layer, attribute)): Object[]));
        } else {
            setFeatureAttributes([]);
        }
    }, [...effectListeners]);

    return featureAttributes;
}

/**
 * Updates state with new modal title.
 *
 * @param {string} activeView Currently active view in modal.
 * @param {Object} activeFeature Active feature's layer name and feature Id.
 * @param {any[]} effectListeners List of items that useEffect listens to (activeView).
 *
 * @returns {string} Modal's title.
 */
export function useTitle(
    activeView: string,
    activeFeature: Object,
    effectListeners: any[],
): string {
    const [title, setTitle] = useState('');
    useEffect(() => {
        switch (activeView) {
            case 'contractDetails':
                return setTitle(strings.modalContractDetails.listView.title);
            case 'singleFeatureDetails':
                return setTitle(`${activeFeature.layerName} ${activeFeature.featureId}`);
            default:
                return setTitle('');
        }
    }, [...effectListeners]);

    return title;
}

/**
 * Updates state with new cancel text.
 *
 * @param {string} activeView Currently active view in modal.
 * @param {string} source Source where modal was opened from.
 * @param {any[]} effectListeners List of items that useEffect listens to (activeView).
 *
 * @returns {string} Modal's cancel text.
 */
export function useCancelText(activeView: string, source: string, effectListeners: any[]): string {
    const [cancelText, setCancelText] = useState(strings.modalContractDetails.cancelText);

    useEffect(() => {
        if (activeView === 'contractDetails' && source !== 'contractModal') {
            setCancelText(strings.modalContractDetails.cancelText);
        } else {
            setCancelText(strings.modalContractDetails.backText);
        }
    }, [...effectListeners]);

    return cancelText;
}
