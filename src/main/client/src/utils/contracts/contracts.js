// @flow
import { toast } from 'react-toastify';
import { queryFeatures } from '../../api/search/searchQuery';
import store from '../../store';
import strings from '../../translations';
import { getContractDocumentUrl } from './contractDocument';
import { nestedVal } from '../nestedValue';
import { linkContract } from '../../api/contract/contractRelations';
import save from '../saveFeatureData';
import { toDisplayDate } from '../date';

/**
 * Gets ID and Description field from contract query, that will be shown in contract list.
 *
 * @param {Object} contracts Contract response from contractRelations query.
 * @param {string} [contractIdField] Name of ID field to be shown in contract list.
 * @param {string} [contractDescriptionField] Name of description field to be
 * shown in contract list.
 * @param {string} [alfrescoLinkField] Name of alfresco link field.
 * @param {string} [caseManagementLinkField] Name of case management link field.
 *
 * @returns {Array} Array containing contract ID, description fields, alfresco link,
 * case management link and attributes.
 */
export const contractListTexts = (
    contracts: { features: Object[] },
    contractIdField?: string,
    contractDescriptionField?: string,
    alfrescoLinkField?: string,
    caseManagementLinkField?: string,
): Object[] => {
    if (contracts && contracts.features) {
        return contracts.features.map(feature => ({
            id: feature.attributes[contractIdField],
            description: feature.attributes[contractDescriptionField],
            alfrescoUrl: alfrescoLinkField ? getContractDocumentUrl('alfresco', alfrescoLinkField, feature.attributes) : '',
            caseManagementUrl: caseManagementLinkField ? getContractDocumentUrl('caseManagement', caseManagementLinkField, feature.attributes) : '',
            attributes: feature.attributes,
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
 * @returns {Object} Current-, and contract layers.
 */
export const getContractLayers = (layerId: string, layerList: Object[]) => {
    if (!layerId) return { currentLayer: null, contractLayer: null };

    const currentLayer = layerList.find(layer => layer.id === layerId
        .replace('.s', ''));
    const relationLayer = currentLayer && layerList
        .find(layer => layer.id === currentLayer.relationLayerId.toString());

    if (currentLayer && relationLayer) {
        switch (currentLayer.relationType) {
            case 'one':
                return {
                    currentLayer,
                    contractLayer: relationLayer,
                };
            case 'many':
                return {
                    currentLayer,
                    contractLayer: layerList
                        .find(layer => layer.id === relationLayer.relationLayerId.toString()),
                };
            default:
                return {
                    currentLayer,
                    contractLayer: null,
                };
        }
    }

    return { currentLayer: null, contractLayer: null };
};

/**
 * Handles contract linking for relation type 'many. Links contract
 * to a layer feature and shows toast message based on whether linking is successful or not.
 *
 * @param {string} contractNumber Contract number to be linked.
 * @param {Object} layer Layer containing feature that will get new contract link.
 * @param {number} objectId Feature's object id that will get new contract link.
 * @param {Object} contractLayer Layer that contains the contract to be linked.
 *
 * @returns {Promise} Returns when contract linking has finished.
 */
export const linkToContract = async (
    contractNumber: string,
    layer: Object,
    objectId: number,
    contractLayer: Object,
) => {
    const res = await queryFeatures(
        contractLayer.id,
        `${contractLayer.contractIdField} = '${contractNumber}'`,
        null,
    );
    const contractObjectId = nestedVal(
        res,
        ['features', '0', 'attributes', res.objectIdFieldName],
    );

    const linkSuccess = await linkContract(
        layer.id,
        objectId,
        contractLayer.id,
        contractObjectId,
    );

    const {
        contractLinked, contractLinkedError, contractLinkedExists,
    } = strings.modalFeatureContracts.linkContract;

    switch (linkSuccess) {
        case 'created':
            toast.success(contractLinked);
            break;
        case 'exists':
            toast.error(contractLinkedExists);
            break;
        default:
            toast.error(contractLinkedError);
    }
};

/**
 * Adds and links detail feature to a contract.
 *
 * @param {Object} layer Detail layer where feature will be added to.
 * @param {Object} contractLayer Contract layer that will get new detail link.
 * @param {number} contractObjectId Contract's object Id.
 * @param {Object} editedFields Fields/attributes from addNewDetail form.
 *
 * @returns {Promise<boolean>} Returns true or false based on successful add/link.
 */
export const addDetailToContract = async (
    layer: Object,
    contractLayer: Object,
    contractObjectId: number,
    editedFields: Object,
): Promise<boolean> => {
    const objectIdFieldName = nestedVal(
        contractLayer.fields.find(field => field.type === 'esriFieldTypeOID'),
        ['name'],
    );
    const contractData = await queryFeatures(
        contractLayer.id,
        `${objectIdFieldName} = '${contractObjectId}'`,
        null,
    );

    const contractRelationColumn = nestedVal(
        contractData,
        ['features', '0', 'attributes', layer.relationColumnIn],
    );

    if (layer.relationType === 'many') {
        if (contractRelationColumn) {
            const features = [{
                attributes: {
                    ...editedFields,
                    [layer.relationColumnOut]: contractRelationColumn,
                },
            }];

            const addRes = await save.saveData(
                'add',
                store.getState().map.mapView.view,
                nestedVal(layer, ['id']),
                features,
                objectIdFieldName,
                undefined,
                false,
                false,
            );

            return nestedVal(addRes, ['addResults', '0', 'success'], false);
        }

        toast.error(strings.modalContractDetails.newDetail.errorAddingFeature);
        return false;
    }

    let features = [{
        attributes: {
            ...editedFields,
        },
    }];

    const addRes = await save.saveData(
        'add',
        store.getState().map.mapView.view,
        nestedVal(layer, ['id']),
        features,
        objectIdFieldName,
        undefined,
        false,
        false,
    );

    if (nestedVal(addRes, ['addResults', '0', 'success'], false)) {
        features = [{
            attributes: {
                [objectIdFieldName]: contractObjectId,
                [layer.relationColumnOut]: editedFields[layer.relationColumnOut],
            },
        }];

        const updateRes = await save.saveData(
            'update',
            store.getState().map.mapView.view,
            contractLayer.id,
            features,
            objectIdFieldName,
            contractObjectId,
            true,
        );

        return !!nestedVal(updateRes, ['features', 'length']);
    }

    return false;
};

/**
 * Handles contract updating for relation type 'one'. Updates contract number for a layer feature
 * and shows toast message based on whether linking is successful or not.
 *
 * @param {string} contractNumber Contract number to be linked.
 * @param {Object} layer Layer containing feature that will get new contract link.
 * @param {number} objectId Feature's object id that will get new contract link.
 * @param {Object} view Esri map view.
 *
 * @returns {Promise} Returns when contract updating has finished.
 */
export const updateContractLink = async (
    contractNumber: string,
    layer: Object,
    objectId: number,
    view: Object,
) => {
    const objectIdFieldName = nestedVal(
        layer.fields.find(field => field.type === 'esriFieldTypeOID'),
        ['name'],
    );

    if (objectIdFieldName && layer.relationColumnOut) {
        const features = [{
            attributes: {
                [objectIdFieldName]: objectId,
                [layer.relationColumnOut]: contractNumber,
            },
        }];

        const res = await save.saveData(
            'update',
            view,
            layer.id,
            features,
            objectIdFieldName,
            objectId,
            true,
        );

        return nestedVal(res, ['features', 'length'])
            ? toast.success(strings.modalFeatureContracts.linkContract.contractLinked)
            : toast.error(strings.modalFeatureContracts.linkContract.contractLinkedError);
    }

    return toast.error(strings.modalFeatureContracts.linkContract.contractLinkedError);
};

/**
 * Creates a list from found feature attributes.
 *
 * @param {Object} layer Currently active layer in contract details modal.
 * @param {Object[]} contractDetails List containing contract feature details.
 * @param {Object} activeFeature Active feature's layer and feature Id.
 *
 * @returns {Array[]} List with found attributes names and values.
 */
export const getFeatureAttributes = (
    layer: Object,
    contractDetails: Object[],
    activeFeature: Object,
): any[] => {
    const idField: string = nestedVal(layer, ['contractIdField']);
    const features: Object[] = nestedVal(
        contractDetails.find(l => l.id === activeFeature.layerId),
        ['features'],
        [],
    );

    return Object.entries(nestedVal(
        features.find(feature => feature.attributes[idField] === activeFeature.featureId),
        ['attributes'],
        {},
    ));
};

/**
 * Parse attribute values to more readable form.
 *
 * @param {Object} layer Currently active layer in contract details modal.
 * @param {any[]} attribute Single attribute with name and value.
 *
 * @returns {{name: string, value: *}} Parsed values.
 */
export const getAttribute = (layer: Object, attribute: any[]): Object => {
    const name = nestedVal(
        layer.fields.find(f => f.name === attribute[0]),
        ['label'],
        attribute[0],
    );
    const value = attribute[1];
    const type = nestedVal(
        layer.fields.find(f => f.name === attribute[0]),
        ['type'],
    );

    switch (type) {
        case 'esriFieldTypeString':
            return {
                name,
                value: value ? String(value).trim() : null,
            };
        case 'esriFieldTypeSmallInteger':
        case 'esriFieldTypeInteger':
            return {
                name,
                value: Number.isNaN(parseInt(value, 10)) ? null : parseInt(value, 10),
            };
        case 'esriFieldTypeDouble':
            return {
                name,
                value: Number.isNaN(parseFloat(value)) ? null : parseFloat(value).toFixed(3),
            };
        case 'esriFieldTypeDate':
            return {
                name,
                value: toDisplayDate(value),
            };
        default:
            return {
                name,
                value: null,
            };
    }
};
