// @flow
import OfflineCache from 'sw-offline-cache';
import { toast } from 'react-toastify';

import strings from '../../translations';
import { addFeatures } from '../../api/map/addFeatures';
import { updateFeatures } from '../../api/map/updateFeatures';
import { deleteFeatures } from '../../api/map/deleteFeatures';
import { ADD_EDIT, SET_EDITS, SET_ACTIVE_MODAL } from '../../constants/actionTypes';

const DATABASE_NAME = 'KSR_OFFLINE';
const DATABASE_VERSION = 1;
const db = new OfflineCache(DATABASE_NAME, DATABASE_VERSION);

/**
 * Saves a failed edit into OfflineCache.
 * When done, dispatches a redux action to increase number of failed edits by one.
 *
 * @param {string} action Type of action ( add | update | delete ).
 * @param {any[]} args Arguments that were used in the api-call initially.
 */
export const handleFailedEdit = (action: string, args: any[]) => async (dispatch: Function) => {
    const edit = {
        action,
        args,
    };

    await db.open();
    await db.addEdit(edit);
    await db.close();

    dispatch({ type: ADD_EDIT });
};

/**
 * Will load all failed edits from OfflineCache.
 *
 * When loaded dispatches a redux action to set the number of failed edits.
 */
export const loadFailedEdits = () => async (dispatch: Function) => {
    await db.open();
    const count = await db.editCount();
    await db.close();

    dispatch({
        type: SET_EDITS,
        count,
    });
};

/**
 * Retries to save a single edit.
 *
 * @param {Object} edit The edit to save.
 * @returns {Promise} Promise that will resolve with edits key.
 */
const retryEdit = async (edit) => {
    switch (edit.edit.action) {
        case 'add':
            return addFeatures(...edit.edit.args)
                .then(() => {
                    toast.success(strings.saveFeatureData.newFeatureSaveSuccess);
                    return edit.key;
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(strings.saveFeatureData.newFeatureSaveError);
                });
        case 'update':
            return updateFeatures(...edit.edit.args)
                .then(() => {
                    toast.success(strings.saveFeatureData.layerUpdateSaveSuccess);
                    return edit.key;
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(strings.saveFeatureData.layerUpdateSaveError);
                });
        case 'delete':
            return deleteFeatures(...edit.edit.args)
                .then(() => {
                    toast.success(strings.saveFeatureData.featureDeleteSuccess);
                    return edit.key;
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(strings.saveFeatureData.featureDeleteError);
                });
        default:
            return Promise.resolve();
    }
};

/**
 * Will try to save edits in the same order, than they are in edits-array.
 *
 * Reason for doing this, is that some edits might need to be executed in specific order.
 *
 * @param {Object[]} edits Array of edits.
 * @param {string[]} saves Array of saved edits.
 * @returns {Promise} Promise that will resolve with an array of saved edits.
 */
const retryEditsInOrder = async (edits, saves) => {
    const currentSaves = Array.isArray(saves) ? saves : [];
    if (edits.length > 0) {
        const edit = edits[0];
        const remainingEdits = edits.slice(1);
        return retryEdit(edit)
            .then(key => retryEditsInOrder(remainingEdits, currentSaves.concat([key])))
            .catch((err) => {
                console.error(err);
                return Promise.resolve(currentSaves);
            });
    }
    return Promise.resolve(currentSaves);
};

/**
 * Retry all edits from the database.
 *
 * Reads all edits from OfflineCache and then tries to save those edits in a sequence.
 */
export const retryEdits = () => async (dispatch: Function) => {
    await db.open();
    const edits = await db.getAllEdits(true);
    const initialCount = edits.length;
    const saves = await retryEditsInOrder(edits, []);
    await saves.forEach(async save => db.removeEdit(save));
    const count = await db.editCount();
    await db.close();

    dispatch({
        type: SET_EDITS,
        count,
    });

    if (count < initialCount) {
        dispatch({
            type: SET_ACTIVE_MODAL,
            activeModal: 'offlineSave',
        });
    }
};

/**
* Removes edits from the OfflineCache.
* When done, dispatches an action to set count of current unsaved edits.
*/
export const removeEdits = () => async (dispatch: Function) => {
    await db.open();
    const edits = await db.getAllEdits(true);
    const removePromises = edits.map(edit => db.removeEdit(edit.key));
    await Promise.all(removePromises);
    const count = await db.editCount();
    await db.close();

    dispatch({
        type: SET_EDITS,
        count,
    });
};
