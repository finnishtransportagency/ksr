// @flow
import * as types from '../../constants/actionTypes';
import featureParser from '../../utils/parseFeatureData';
import { featureDataMock } from '../../mock-data/featureData';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const toggleFilter = () => ({
    type: types.TOGGLE_FILTER,
});

export const getFeatureData = () => (dispatch: Function) => {
    dispatch({ type: types.GET_FEATURES });
    // TODO: change to fetch when we have real data
    const mockData = featureDataMock;
    const data = featureParser.parseData(mockData);
    const columns = featureParser.parseColumns(mockData);
    dispatch({
        type: types.GET_FEATURES_FULFILLED, payload: mockData, data, columns,
    });
};

export const setFeatureData = (columnData: Array<Object>) => (dispatch: Function) => {
    dispatch({
        type: types.SET_FEATURES, payload: columnData,
    });
};

