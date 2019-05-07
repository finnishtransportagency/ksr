// @flow
import { toast } from 'react-toastify';
import { queryFeatures } from '../../api/search/searchQuery';
import store from '../../store';
import strings from '../../translations';
import { getContractDocumentUrl } from './contractDocument';
import { nestedVal } from '../nestedValue';
import { linkContract, unlinkContract } from '../../api/contract/contractRelations';
import save from '../saveFeatureData';
import { toDisplayDate } from '../date';
import { getCodedValue } from '../parseFeatureData';

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
 * Unlinks detail or geometry feature from contract.
 *
 * @param {Object} contractLayer Contract layer where feature will be unlinked from.
 * @param {Object} detailLayer Detail layer that contains feature that will be unlinked.
 * @param {number} contractObjectId Contract's object Id.
 * @param {number} featureObjectId Feature's object Id.
 *
 * @returns {Promise<boolean>} Promise with unlink success.
 */
export const unlinkFeatureFromContract = async (
    contractLayer: Object,
    detailLayer: Object,
    contractObjectId: number,
    featureObjectId: number,
): Promise<boolean> => {
    /** Detail linked with a field in detail- or contract layer */
    if (String(detailLayer.relationLayerId) === contractLayer.id) {
        const targetLayer = detailLayer.relationType === 'many' ? detailLayer : contractLayer;
        const objectId = detailLayer.relationType === 'many' ? featureObjectId : contractObjectId;
        const relationColumn = detailLayer.relationType === 'many'
            ? detailLayer.relationColumnOut
            : detailLayer.relationColumnIn;
        const objectIdFieldName = nestedVal(
            targetLayer.fields.find(field => field.type === 'esriFieldTypeOID'),
            ['name'],
        );

        const features = [{
            attributes: {
                [objectIdFieldName]: objectId,
                [relationColumn]: null,
            },
        }];

        const updateRes = await save.saveData(
            'update',
            store.getState().map.mapView.view,
            targetLayer.id,
            features,
            objectIdFieldName,
            objectId,
            true,
        );

        return !!nestedVal(updateRes, ['features', 'length']);
    }

    /** Detail linked with separate link layer */
    if (String(detailLayer.relationLayerId) !== contractLayer.id) {
        return unlinkContract(
            detailLayer.id,
            featureObjectId,
            contractLayer.id,
            contractObjectId,
        );
    }

    return false;
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
 * Get either the original or coded value based on whether feature is being edited or not.
 * Edited field wouldn't show correct value if it has been changed to coded value.
 *
 * @param {string} value Attribute's value.
 * @param {Object} domain Field's domain containing coded value info.
 * @param {string} name Field's name.
 * @param {boolean} edit Whether feature is being edited or not.
 *
 * @returns {string | null} Original or coded value.
 */
export const attributeValue = (
    value: string,
    domain: Object,
    name: string,
    edit: boolean,
) => {
    if (value) {
        if (name === 'CONTRACT_UUID') return null;
        if (getCodedValue(domain, value) && !edit) {
            return getCodedValue(domain, value).trim();
        }
        return value;
    }
    return null;
};

/**
 * Parse attribute values to more readable form.
 *
 * @param {Object} layer Currently active layer in contract details modal.
 * @param {any[]} attribute Single attribute with name and value.
 * @param {boolean} edit Whether feature is being edited or not.
 *
 * @returns {{name: string, label: string, value: *, hidden: boolean}} Parsed values.
 */
export const getAttribute = (layer: Object, attribute: any[], edit: boolean): Object => {
    const field = layer.fields.find(f => f.name === attribute[0]);
    const name = nestedVal(
        field,
        ['name'],
        attribute[0],
    );
    const label = nestedVal(
        field,
        ['label'],
        attribute[0],
    );
    const value = attribute[1];
    const type = nestedVal(
        field,
        ['type'],
    );

    const { domain } = field;

    switch (type) {
        case 'esriFieldTypeOID':
            return {
                name,
                label,
                value,
                hidden: true,
            };
        case 'esriFieldTypeString':
            return {
                name,
                label,
                value: attributeValue(value, domain, name, edit),
                hidden: false,
            };
        case 'esriFieldTypeSmallInteger':
        case 'esriFieldTypeInteger':
            return {
                name,
                label,
                value: Number.isNaN(parseInt(value, 10)) ? null : parseInt(value, 10),
                hidden: false,
            };
        case 'esriFieldTypeDouble':
            return {
                name,
                label,
                value: Number.isNaN(parseFloat(value)) ? null : parseFloat(value).toFixed(3),
                hidden: false,
            };
        case 'esriFieldTypeDate':
            return {
                name,
                label,
                value: edit ? value : toDisplayDate(value),
                hidden: false,
            };
        default:
            return {
                name,
                label,
                value: null,
                hidden: false,
            };
    }
};

/**
 * Compare original and edited value to check if value has been edited.
 *
 * @param {Object} field Feature's field.
 * @param {string} name Edited field's name.
 * @param {Object} existingAttributes Feature's existing attributes.
 * @param {string} value Edited value.
 *
 * @returns {boolean} Returns whether the value has been edited or not.
 */
export const fieldEdited = (
    field: Object,
    name: string,
    existingAttributes: Object,
    value: string,
): boolean => {
    const existingValue = existingAttributes[name];
    if (field.name === name) {
        if (value || existingValue) {
            return existingValue !== value;
        }
        return false;
    }
    return field.edited;
};
