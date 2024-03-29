// @flow
import { fetchPropertyInfo } from '../../api/search/searchProperty';
import * as types from '../../constants/actionTypes';
import { abortFetch } from '../../utils/abortFetch';
import { drawPropertyArea, removeGraphicsFromMap } from '../../utils/map';
import { nestedVal } from '../../utils/nestedValue';
import { childLayerDomainValues, filterNotAllowedFields } from '../../utils/fields';

export const setSearchState = (
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    suggestions: Array<string>,
    suggestionsActive: boolean,
): {
  searchFieldValues: Array<any>,
  selectedLayer: number,
  suggestions: Array<string>,
  suggestionsActive: boolean,
  textSearch: string,
  type: any,
  ...
} => ({
    type: types.SET_SEARCH_STATE,
    selectedLayer,
    textSearch,
    searchFieldValues,
    suggestions,
    suggestionsActive,
});

export const setSearchOptions = (
    selectedLayer: number,
    layerList: any,
): { optionsField: Array<any>, type: any, ... } => {
    let layerFields = nestedVal(
        layerList.find(l => l.id === selectedLayer),
        ['fields'],
        [],
    );

    if (nestedVal(layerList.find(layer => layer.id === selectedLayer), ['parentLayer'])) {
        const parentLayerId = nestedVal(
            layerList.find(layer => layer.id === selectedLayer),
            ['parentLayer'],
        );
        const parentLayer = layerList.find(layer => layer.id === parentLayerId);
        layerFields = layerFields.map(field => childLayerDomainValues(field, parentLayer));
    }

    return {
        type: types.SET_SEARCH_OPTIONS,
        optionsField: filterNotAllowedFields(layerFields),
    };
};

export const clearProperties = (graphicId: string, view: Object): { type: any, ... } => {
    removeGraphicsFromMap(view, graphicId);
    removeGraphicsFromMap(view, 'propertyAreaLabel');
    return { type: types.CLEAR_PROPERTY_INFO };
};

let propertyController;
let propertySignal;
/**
 * Gets property info and pdf links connected to a property.
 *
 * Works with point geometry, area geometry or text search with property identifier.
 *
 * Found data is saved in redux state and found features are
 * drawn as new graphics (and previous graphics with same id are deleted).
 *
 * @param {Object | String} queryParameters Parameters used in property info fetch.
 * Can be either { polygon: ... } | { x: ..., y: ... } | Property identifier as string.
 * @param {Object} view Esri map view.
 * @param {string} graphicId Unique id used for property highlight graphics.
 * @param {Object[]} authorities Currently logged in users authorities.
 */
export const setPropertyInfo = (
    queryParameters: Object | string,
    view: Object,
    graphicId: string,
    authorities: Object[],
): ((dispatch: any) => void) => (dispatch: Function) => {
    dispatch({
        type: types.SET_PROPERTY_INFO,
        fetching: true,
    });

    removeGraphicsFromMap(view, graphicId);
    removeGraphicsFromMap(view, 'propertyAreaLabel');

    ({ controller: propertyController, signal: propertySignal } = abortFetch(propertyController));
    fetchPropertyInfo(queryParameters, propertySignal)
        .then((result) => {
            if (result.features.length) {
                dispatch({
                    type: types.SET_PROPERTY_INFO_FULFILLED,
                    features: result.features.map(property => ({
                        id: property.properties.propertyIdentifier,
                        properties: property.properties,
                        geometry: property.geometry,
                    })),
                });

                drawPropertyArea(view, result.features);

                // TODO: Disabled property PDF -query in KSR-448.
                //  Can be added back back after API -agreement has been finished.
                // const allowedUsers = [
                //     'KSR_ROLE_ADMIN',
                //     'KSR_ROLE_UPDATER',
                //     'KSR_ROLE_EXTERNAL_UPDATER',
                //     'KSR_ROLE_NAMED_USER',
                // ];
                // const hasPermission = allowedUsers.some(allowedUser => (
                //     authorities.find(auth => auth.authority === allowedUser)));
                //
                // result.features.forEach((property) => {
                //     if (hasPermission) {
                //         dispatch({
                //             type: types.SET_PROPERTY_INFO_LINKS,
                //         });
                //
                //         const { propertyIdentifier } = property.properties;
                //         fetchPropertyPdfLinks(propertyIdentifier, strings.getLanguage())
                //             .then((linksRes) => {
                //                 if (linksRes) {
                //                     const linksResApiUrls = {
                //                         deed: linksRes.deed,
                //                         easement: linksRes.easement,
                //                         map: linksRes.map,
                //                         registerunit: linksRes.registerunit,
                //                     };
                //
                //                     dispatch({
                //                         type: types.SET_PROPERTY_INFO_LINKS_FULFILLED,
                //                         links: linksResApiUrls,
                //                         propertyIdentifier,
                //                     });
                //                 } else {
                //                     dispatch({
                //                         type: types.SET_PROPERTY_INFO_LINKS_REJECTED,
                //                         propertyIdentifier,
                //                     });
                //                 }
                //             })
                //             .catch(error => console.log(error));
                //     }
                // });
            } else {
                dispatch({
                    type: types.SET_PROPERTY_INFO_REJECTED,
                });
            }
        })
        .catch((error) => {
            if (!error.toString().includes('Abort')) {
                console.error(error);
                dispatch({
                    type: types.SET_PROPERTY_INFO_REJECTED,
                });
            }
        });
};

export const setActiveSearch = (activeSearch: string): { activeSearch: string, type: any, ... } => ({
    type: types.SET_ACTIVE_SEARCH,
    activeSearch,
});

export const togglePropertyAreaSearch = (): { type: any, ... } => ({
    type: types.TOGGLE_PROPERTY_AREA_SEARCH,
});
