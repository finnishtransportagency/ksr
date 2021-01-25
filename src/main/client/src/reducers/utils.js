// @flow
import store from '../store';
import { toggleTable } from './table/actions';

/**
 * Close table view if nothing is shown in it.
 */
export const closeTableIfNothingToShow = () => {
    const { table } = store.getState();

    if (!table.features.editedLayers.length && table.toggleTable) {
        store.dispatch(toggleTable());
    }
};
