// @flow

import * as querystring from 'querystring';
import { toast } from 'react-toastify';
import { addFeatures } from '../../api/map/addFeatures';
import { updateFeatures } from '../../api/map/updateFeatures';
import { queryFeatures } from '../../api/search/searchQuery';
import strings from '../../translations';

/**
 * Gets ID and Description field from contract query, that will be shown in contract list.
 *
 * @param {Object} contracts Contract response from contractRelations query.
 * @param {string} contractIdField Name of ID field to be shown in contract list.
 * @param {string} contractDescriptionField Name of description field to be shown in contract list.
 *
 * @returns {Array} Array containing contract ID and description fields.
 */
export const contractListTexts = (
    contracts: { features: Object[] },
    contractIdField: string,
    contractDescriptionField: string,
): Object[] => {
    if (contracts && contracts.features) {
        return contracts.features.map(feature => ({
            id: feature.attributes[contractIdField],
            description: feature.attributes[contractDescriptionField],
        }));
    }
    return [];
};

/**
 * Gets layer ID to query for an existing contract and layer to update.
 *
 * @param {Object} currentLayer Currently active layer in contract modal.
 * @param {Object} relationLayer Currently active layers closest contract relation layer.
 *
 * @returns {Object} Object with layer to query and layer to update.
 */
export const getRelationLayers = (currentLayer: Object, relationLayer: Object) => {
    switch (currentLayer.relationType) {
        case 'one':
            return {
                layerToQuery: relationLayer.id,
                layerToUpdate: currentLayer,
            };
        case 'many':
            return {
                layerToQuery: relationLayer.relationLayerId,
                layerToUpdate: relationLayer,
            };
        default:
            return {
                layerToQuery: 0,
                layerToUpdate: {},
            };
    }
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
 * @param {Object} currentLayer Currently active layer in contract modal.
 * @param {Object} relationLayer Currently active layers closest relation layer.
 * @param {number} contractNumber Contract number.
 *
 * @returns {Promise} Promise object with object IDs to be deleted.
 */
export const getUnlinkParams = async (
    currentLayer: Object,
    relationLayer: Object,
    contractNumber: number,
) => {
    try {
        const { contractIdField } = currentLayer;
        const {
            relationLayerId, relationColumnOut, fields, id,
        } = relationLayer;

        const contractUuid = await queryFeatures(relationLayerId, `${contractIdField} = '${contractNumber}'`)
            .then(res => res.features[0].attributes[relationColumnOut]);
        const objectIdField = fields.find(a => a.type === 'esriFieldTypeOID').name;

        const objectIdToDelete = await queryFeatures(id, `${relationColumnOut} = '${contractUuid}'`)
            .then(r => r.features[0].attributes[objectIdField]);

        return querystring.stringify({
            f: 'json',
            objectIds: [objectIdToDelete],
        });
    } catch (error) {
        return '';
    }
};
