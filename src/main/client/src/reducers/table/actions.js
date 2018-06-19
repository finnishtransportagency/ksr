// @flow
import * as types from '../../constants/actionTypes';
import { parseData, parseColumns } from '../../utils/parseFeatureData';
import { featureDataMock } from '../../mock-data/featureData';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const getFeatureData = () => (dispatch: Function) => {
    dispatch({ type: types.GET_FEATURES });
    // TODO: change to fetch when we have real data
    const mockData = featureDataMock;
    const data = parseData(mockData, false, 'search');
    const columns = parseColumns(mockData);
    dispatch({
        type: types.GET_FEATURES_FULFILLED, payload: mockData, data, columns,
    });
};

export const selectFeatures = (features) => {
    const data = parseData(features, true, 'select');
    const columns = parseColumns(features);
    return {
        type: types.SELECT_FEATURES,
        data,
        columns,
        features,
    };
};
