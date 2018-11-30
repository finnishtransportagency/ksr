import * as types from '../../../constants/actionTypes';
import reducer from '../propertyInfo';

const initialState = {
    features: [],
    fetching: false,
    propertyAreaSearch: false,
};

describe('Property info reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle SET_PROPERTY_INFO', () => {
        expect(reducer(undefined, {
            type: types.SET_PROPERTY_INFO,
        })).toEqual({ ...initialState, fetching: true });
    });

    it('should handle SET_PROPERTY_INFO_FULFILLED', () => {
        const action = {
            features: [{
                id: 123456789,
                properties: {
                    parcelCount: 1,
                    registerUnitType: 'register unit',
                    name: 'property name',
                    landArea: 123.123,
                    registrationDate: '20151231',
                    municipalityName: 'municipality name',
                    propertyIdentifier: '123456789',
                },
                geometry: [],
                fetchingLinks: false,
                links: null,
            }],
        };

        expect(reducer(undefined, {
            type: types.SET_PROPERTY_INFO_FULFILLED,
            features: action.features,
        })).toEqual({
            ...initialState,
            features: action.features,
        });
    });

    it('should handle SET_PROPERTY_INFO_REJECTED', () => {
        expect(reducer(undefined, {
            type: types.SET_PROPERTY_INFO_REJECTED,
        })).toEqual({ ...initialState });
    });

    const state = {
        features: [{
            id: 123456789,
            properties: {
                parcelCount: 1,
                registerUnitType: 'register unit',
                name: 'property name',
                landArea: 123.123,
                registrationDate: '20151231',
                municipalityName: 'municipality name',
                propertyIdentifier: '123456789',
            },
            geometry: [],
            links: null,
            fetchingLinks: false,
        }],
        fetching: false,
        propertyAreaSearch: false,
    };

    it('should handle SET_PROPERTY_INFO_LINKS', () => {
        expect(reducer({ ...state }, {
            type: types.SET_PROPERTY_INFO_LINKS,
        })).toEqual({
            ...state,
            features: state.features.map(feature => ({
                ...feature,
                fetchingLinks: true,
            })),
        });
    });

    it('should handle SET_PROPERTY_INFO_LINKS_FULFILLED', () => {
        const action = {
            links: {
                registerunit: ['http://test.url'],
                deed: ['http://test.url'],
                easement: ['http://test.url'],
                map: ['http://test.url'],
            },
            featureId: '123456789',
        };

        expect(reducer({ ...state }, {
            type: types.SET_PROPERTY_INFO_LINKS_FULFILLED,
            links: action.links,
            featureId: action.featureId,
        })).toEqual({
            ...state,
            features: state.features.map(feature => ({
                ...feature,
                links: feature.id === action.featureId ? action.links : feature.links,
                fetchingLinks: !feature.id === action.featureId,
            })),
        });
    });

    it('should handle SET_PROPERTY_INFO_LINKS_REJECTED', () => {
        const action = {
            featureId: '123456789',
        };

        expect(reducer({ ...state }, {
            type: types.SET_PROPERTY_INFO_LINKS_REJECTED,
            featureId: action.featureId,
        })).toEqual({
            ...state,
            features: state.features.map(feature => ({
                ...feature,
                fetchingLinks: !feature.id === action.featureId,
            })),
        });
    });

    it('should handle TOGGLE_PROPERTY_AREA_SEARCH', () => {
        expect(reducer({ ...state }, {
            type: types.TOGGLE_PROPERTY_AREA_SEARCH,
        })).toEqual({
            ...state,
            propertyAreaSearch: !state.propertyAreaSearch,
        });
    });

    it('should handle CLEAR_PROPERTY_INFO', () => {
        const currentState = {
            id: '1-2-3-4',
            properties: {
                parcelCount: 1,
                registerUnitType: 'register unit',
                name: 'property name',
                landArea: 123.123,
                registrationDate: '20151231',
                municipalityName: 'municipality name',
                propertyIdentifier: '123456789',
            },
            geometry: null,
            links: {
                registerunit: ['http://test.url'],
                deed: ['http://test.url'],
                easement: ['http://test.url'],
                map: ['http://test.url'],
            },
            fetching: true,
            fetchingLinks: true,
        };

        expect(reducer(currentState, { type: types.CLEAR_PROPERTY_INFO }))
            .toEqual(initialState);
    });
});
