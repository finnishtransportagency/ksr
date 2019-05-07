// @flow
import {
    SET_PROPERTY_INFO,
    SET_PROPERTY_INFO_FULFILLED,
    SET_PROPERTY_INFO_REJECTED,
    SET_PROPERTY_INFO_LINKS,
    SET_PROPERTY_INFO_LINKS_FULFILLED,
    SET_PROPERTY_INFO_LINKS_REJECTED,
    TOGGLE_PROPERTY_AREA_SEARCH,
    CLEAR_PROPERTY_INFO,
} from '../../constants/actionTypes';

type Properties = {
    parcelCount: number,
    registerUnitType: string,
    name: string,
    landArea: number,
    registrationDate: string,
    municipalityName: string,
    propertyIdentifier: string,
}

type Property = {
    id: string,
    properties: Properties,
    geometry: Object,
    links: ?Object,
    fetchingLinks: boolean,
}

type State = {
    features: Property[],
    fetching: boolean,
    propertyAreaSearch: boolean,
};

type Action = {
    type: string,
    features: Property[],
    links: Object,
    propertyIdentifier: string,
};

const initialState = {
    features: [],
    fetching: false,
    propertyAreaSearch: false,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_PROPERTY_INFO:
            return {
                ...initialState,
                fetching: true,
                propertyAreaSearch: state.propertyAreaSearch,
            };
        case SET_PROPERTY_INFO_FULFILLED:
            return {
                ...state,
                features: (action.features.map(property => ({
                    ...property,
                    fetchingLinks: false,
                    links: null,
                })): Property[]),
                fetching: false,
            };
        case SET_PROPERTY_INFO_REJECTED:
            return {
                ...initialState,
                propertyAreaSearch: state.propertyAreaSearch,
            };
        case SET_PROPERTY_INFO_LINKS:
            return {
                ...state,
                features: (state.features.map(property => ({
                    ...property,
                    fetchingLinks: true,
                })): Property[]),
            };
        case SET_PROPERTY_INFO_LINKS_FULFILLED:
            return {
                ...state,
                features: (state.features.map(feature => ({
                    ...feature,
                    links: feature.properties.propertyIdentifier === action.propertyIdentifier
                        ? action.links
                        : feature.links,
                    fetchingLinks: !feature.properties.propertyIdentifier ===
                        action.propertyIdentifier,
                })): Property[]),
            };
        case SET_PROPERTY_INFO_LINKS_REJECTED:
            return {
                ...state,
                features: (state.features.map(property => ({
                    ...property,
                    fetchingLinks: !property.properties.propertyIdentifier ===
                        action.propertyIdentifier,
                })): Property[]),
            };
        case TOGGLE_PROPERTY_AREA_SEARCH:
            return {
                ...state,
                propertyAreaSearch: !state.propertyAreaSearch,
            };
        case CLEAR_PROPERTY_INFO:
            return {
                ...initialState,
                propertyAreaSearch: state.propertyAreaSearch,
            };
        default:
            return state;
    }
};
