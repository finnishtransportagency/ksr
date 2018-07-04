// @flow
import * as types from '../../constants/actionTypes';
import { parseData } from '../../utils/parseFeatureData';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const toggleFilter = () => ({
    type: types.TOGGLE_FILTER,
});

export const selectFeatures = (features: {}) => ({
    type: types.SELECT_FEATURES,
    layers: parseData(features, true, 'select'),
});

export const setColumns = (columns: Array<Object>) => ({
    type: types.SET_COLUMNS,
    columns,
});

export const setActiveTable = (activeTable: string) => ({
    type: types.SET_ACTIVE_TABLE,
    activeTable,
});

export const deSelectSelected = () => ({
    type: types.DE_SELECT_SELECTED_FEATURES,
});

export const toggleSelection = feature => ({
    type: types.TOGGLE_SELECTION,
    feature,
});
