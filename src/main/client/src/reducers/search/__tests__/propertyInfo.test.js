import * as types from '../../../constants/actionTypes';
import reducer from '../propertyInfo';

const initialState = {
    id: null,
    properties: null,
    geometry: null,
    links: null,
    fetching: false,
    fetchingLinks: false,
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
        };

        expect(reducer(undefined, {
            type: types.SET_PROPERTY_INFO_FULFILLED,
            id: action.id,
            properties: action.properties,
            geometry: action.geometry,
        })).toEqual({
            ...initialState,
            id: action.id,
            properties: action.properties,
            geometry: action.geometry,
            fetching: false,
        });
    });

    it('should handle SET_PROPERTY_INFO_REJECTED', () => {
        expect(reducer(undefined, {
            type: types.SET_PROPERTY_INFO_REJECTED,
        })).toEqual({ ...initialState });
    });

    const state = {
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
        fetching: false,
        fetchingLinks: false,
    };

    it('should handle SET_PROPERTY_INFO_LINKS', () => {
        expect(reducer({ ...state }, {
            type: types.SET_PROPERTY_INFO_LINKS,
        })).toEqual({ ...state, fetchingLinks: true });
    });

    it('should handle SET_PROPERTY_INFO_LINKS_FULFILLED', () => {
        const action = {
            links: {
                registerunit: ['http://test.url'],
                deed: ['http://test.url'],
                easement: ['http://test.url'],
                map: ['http://test.url'],
            },
        };

        expect(reducer({ ...state }, {
            type: types.SET_PROPERTY_INFO_LINKS_FULFILLED,
            links: action.links,
        })).toEqual({
            ...state,
            links: action.links,
            fetchingLinks: false,
        });
    });

    it('should handle SET_PROPERTY_INFO_LINKS_REJECTED', () => {
        expect(reducer({ ...state }, {
            type: types.SET_PROPERTY_INFO_LINKS_REJECTED,
        })).toEqual({ ...state });
    });
});
