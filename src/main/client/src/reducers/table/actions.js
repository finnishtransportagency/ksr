// @flow
import * as types from '../../constants/actionTypes';
import { parseData, parseColumns } from '../../utils/parseFeatureData';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const selectFeatures = (features: {}) => {
    const data = parseData(features, true, 'select');
    const columns = parseColumns(features);
    return {
        type: types.SELECT_FEATURES,
        data,
        columns,
        features,
    };
};
