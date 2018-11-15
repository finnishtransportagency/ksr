// @flow
import {
    SET_PROPERTY_INFO,
    SET_PROPERTY_INFO_FULFILLED,
    SET_PROPERTY_INFO_REJECTED,
    SET_PROPERTY_INFO_LINKS,
    SET_PROPERTY_INFO_LINKS_FULFILLED,
    SET_PROPERTY_INFO_LINKS_REJECTED,
} from '../../constants/actionTypes';

type Properties = {
    parcelCount: number,
    registerUnitType: string,
    name: string,
    landArea: number,
    registrationDate: string,
    municipalityName: string,
    propertyIdentifier: string
}

type State = {
    id: ?string,
    properties: ?Properties,
    geometry: ?Object,
    links: ?Object,
    fetching: boolean,
    fetchingLinks: boolean,
};

type Action = {
    type: string,
    id: string,
    properties: Properties,
    geometry: Object,
    links: Object,
};

const initialState = {
    id: null,
    properties: null,
    geometry: null,
    links: null,
    fetching: false,
    fetchingLinks: false,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_PROPERTY_INFO:
            return {
                ...initialState,
                fetching: true,
            };
        case SET_PROPERTY_INFO_FULFILLED:
            return {
                ...state,
                id: action.id,
                properties: action.properties,
                geometry: action.geometry,
                fetching: false,
            };
        case SET_PROPERTY_INFO_REJECTED:
            return initialState;
        case SET_PROPERTY_INFO_LINKS:
            return {
                ...state,
                fetchingLinks: true,
            };
        case SET_PROPERTY_INFO_LINKS_FULFILLED:
            return {
                ...state,
                links: action.links,
                fetchingLinks: false,
            };
        case SET_PROPERTY_INFO_LINKS_REJECTED:
            return {
                ...state,
                fetchingLinks: false,
            };
        default:
            return state;
    }
};
