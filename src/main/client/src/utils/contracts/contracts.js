// @flow

import * as querystring from 'querystring';
import { toast } from 'react-toastify';
import { addFeatures } from '../../api/map/addFeatures';
import { updateFeatures } from '../../api/map/updateFeatures';
import { queryFeatures } from '../../api/search/searchQuery';
import strings from '../../translations';
import { getContractDocumentUrl } from './contractDocument';

/**
 * Gets ID and Description field from contract query, that will be shown in contract list.
 *
 * @param {Object} contracts Contract response from contractRelations query.
 * @param {string} contractIdField Name of ID field to be shown in contract list.
 * @param {string} contractDescriptionField Name of description field to be shown in contract list.
 * @param {string} [alfrescoLinkField] Name of alfresco link field.
 * @param {string} [caseManagementLinkField] Name of case management link field.
 *
 * @returns {Array} Array containing contract ID and description fields.
 */
export const contractListTexts = (
    contracts: { features: Object[] },
    contractIdField: string,
    contractDescriptionField: string,
    alfrescoLinkField: ?string,
    caseManagementLinkField: ?string,
): Object[] => {
    if (contracts && contracts.features) {
        return contracts.features.map(feature => ({
            id: feature.attributes[contractIdField],
            description: feature.attributes[contractDescriptionField],
            alfrescoUrl: alfrescoLinkField ? getContractDocumentUrl('alfresco', alfrescoLinkField, feature.attributes) : '',
            caseManagementUrl: caseManagementLinkField ? getContractDocumentUrl('caseManagement', caseManagementLinkField, feature.attributes) : '',
        }));
    }
    return [];
};

/**
 * Gets all contract related layers used for linking and creating new contracts.
 *
 * @param {string} layerId Geometry layer's id.
 * @param {Object[]} layerList List of layers.
 *
 * @returns {Object} Current-, contractLink and contract layers.
 */
export const getContractLayers = (layerId: string, layerList: Object[]) => {
    if (!layerId) return { currentLayer: null, contractLinkLayer: null, contractLayer: null };

    const currentLayer = layerList.find(layer => layer.id === layerId
        .replace('.s', ''));
    const relationLayer = currentLayer && layerList
        .find(layer => layer.id === currentLayer.relationLayerId.toString());

    if (currentLayer && relationLayer) {
        switch (currentLayer.relationType) {
            case 'one':
                return {
                    currentLayer,
                    contractLinkLayer: null,
                    contractLayer: relationLayer,
                };
            case 'many':
                return {
                    currentLayer,
                    contractLinkLayer: relationLayer,
                    contractLayer: layerList
                        .find(layer => layer.id === relationLayer.relationLayerId.toString()),
                };
            default:
                return {
                    currentLayer,
                    contractLinkLayer: null,
                    contractLayer: null,
                };
        }
    }

    return { currentLayer: null, contractLinkLayer: null, contractLayer: null };
};

/**
 * Handles contract link submit. If layers relation type is 'link', contract link will be added
 * as new link. Otherwise existing link will be replaced with new one.
 *
 * @param {number} contractNumber Contract number.
 * @param {Object} contractUpdateLayer Layer that will be updated.
 * @param {string} contractUuid Linkable contracts unique identifier.
 * @param {number} objectId Objectid fields value.
 * @param {Object} currentLayer Currently active layer in contract modal.
 *
 * @returns {Promise} Returns when queries completed.
 */
export const linkToContract = async (
    contractNumber: ?number,
    contractUpdateLayer: Object,
    contractUuid: string,
    objectId: number,
    currentLayer: Object,
) => {
    const { relationColumnIn, relationColumnOut, id } = contractUpdateLayer;

    try {
        if (contractUpdateLayer.relationType === 'link') {
            const features = JSON.stringify([{
                attributes: {
                    [relationColumnIn]: objectId,
                    [relationColumnOut]: contractUuid,
                },
            }]);

            const params = querystring.stringify({ f: 'json', features });
            const whereQueryString = `${relationColumnOut} = '${contractUuid}' AND ${relationColumnIn} = '${objectId}'`;

            const queryResult = await queryFeatures(id, whereQueryString);
            if (!queryResult.features.length) {
                await addFeatures(id, params);
                toast.success(strings.modalFeatureContracts.linkContract.contractLinked);
            } else {
                toast.error(strings.modalFeatureContracts.linkContract.contractLinkedExists);
            }
        } else {
            const objectIdField = currentLayer.fields
                .find(field => field.type === 'esriFieldTypeOID').name;
            const features = JSON.stringify([{
                attributes: {
                    [objectIdField]: objectId,
                    [relationColumnOut]: contractNumber,
                },
            }]);
            const params = querystring.stringify({ f: 'json', features });

            await updateFeatures(currentLayer.id, params);
            toast.success(strings.modalFeatureContracts.linkContract.contractLinked);
        }
    } catch (error) {
        toast.error(strings.saveFeatureData.contractLinkedError);
    }
};

/**
 * Gets query parameters to be used in unlinking contract.
 *
 * @param {Object} contractLinkLayer Currently active layer's contract link layer.
 * @param {Object} contractLayer Currently active layer's contract layer.
 * @param {number} contractNumber Contract number.
 *
 * @returns {Promise} Promise object with object IDs to be deleted.
 */
export const getUnlinkParams = async (
    contractLinkLayer: Object,
    contractLayer: Object,
    contractNumber: number,
) => {
    try {
        const { contractIdField, id: contractId } = contractLayer;
        const { relationColumnOut, fields, id: linkId } = contractLinkLayer;

        let res = await queryFeatures(contractId, `${contractIdField} = '${contractNumber}'`);
        const contractUuid = res.features[0].attributes[relationColumnOut];

        const objectIdField = fields.find(a => a.type === 'esriFieldTypeOID').name;
        res = await queryFeatures(linkId, `${relationColumnOut} = '${contractUuid}'`);
        const objectIdToDelete = res.features[0].attributes[objectIdField];

        return querystring.stringify({
            f: 'json',
            objectIds: [objectIdToDelete],
        });
    } catch (error) {
        return '';
    }
};
