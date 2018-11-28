// @flow
import {
    SET_PROPERTY_INFO,
    SET_PROPERTY_INFO_FULFILLED,
    SET_PROPERTY_INFO_REJECTED,
    SET_PROPERTY_INFO_LINKS,
    SET_PROPERTY_INFO_LINKS_FULFILLED,
    SET_PROPERTY_INFO_LINKS_REJECTED,
    TOGGLE_PROPERTY_AREA_SEARCH,
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

type Feature = {
    id: string,
    properties: Properties,
    geometry: Object,
    links: ?Object,
    fetchingLinks: boolean,
}

type State = {
    features: Feature[],
    fetching: boolean,
    propertyAreaSearch: boolean,
};

type Action = {
    type: string,
    features: Feature[],
    links: Object,
    featureId: string,
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
                features: (action.features.map(feature => ({
                    ...feature,
                    fetchingLinks: false,
                    links: null,
                })): Feature[]),
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
                features: (state.features.map(feature => ({
                    ...feature,
                    fetchingLinks: true,
                })): Feature[]),
            };
        case SET_PROPERTY_INFO_LINKS_FULFILLED:
            return {
                ...state,
                features: (state.features.map(feature => ({
                    ...feature,
                    links: feature.id === action.featureId ? action.links : feature.links,
                    fetchingLinks: !feature.id === action.featureId,
                })): Feature[]),
            };
        case SET_PROPERTY_INFO_LINKS_REJECTED:
            return {
                ...state,
                features: (state.features.map(feature => ({
                    ...feature,
                    fetchingLinks: !feature.id === action.featureId,
                })): Feature[]),
            };
        case TOGGLE_PROPERTY_AREA_SEARCH:
            return {
                ...state,
                propertyAreaSearch: !state.propertyAreaSearch,
            };
        default:
            return state;
    }
};
