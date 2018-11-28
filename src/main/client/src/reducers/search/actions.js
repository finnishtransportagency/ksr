// @flow
import { fetchPropertyInfo, fetchPropertyPdfLinks } from '../../api/search/searchProperty';
import * as types from '../../constants/actionTypes';
import strings from '../../translations';
import { abortFetch } from '../../utils/abortFetch';
import { drawPropertyArea, removeGraphicsFromMap } from '../../utils/map';

export const setSearchState = (
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    suggestions: Array<string>,
    suggestionsActive: boolean,
) => ({
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
) => ({
    type: types.SET_SEARCH_OPTIONS,
    optionsField: layerList.find(l => l.id === selectedLayer).fields,
});

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
) => (dispatch: Function) => {
    dispatch({
        type: types.SET_PROPERTY_INFO,
        fetching: true,
    });

    removeGraphicsFromMap(view, graphicId);

    ({ controller: propertyController, signal: propertySignal } = abortFetch(propertyController));
    fetchPropertyInfo(queryParameters, propertySignal)
        .then((result) => {
            if (result.features.length) {
                dispatch({
                    type: types.SET_PROPERTY_INFO_FULFILLED,
                    features: result.features.map(feature => ({
                        id: feature.id,
                        properties: feature.properties,
                        geometry: feature.geometry,
                    })),
                });

                const allowedUsers = ['KSR_ROLE_ADMIN', 'KSR_ROLE_UPDATER', 'KSR_ROLE_NAMED_USER'];
                const hasPermission = allowedUsers.some(allowedUser =>
                    authorities.find(auth => auth.authority === allowedUser));

                result.features.forEach((feature) => {
                    drawPropertyArea(view, feature.geometry.coordinates);

                    if (hasPermission) {
                        dispatch({
                            type: types.SET_PROPERTY_INFO_LINKS,
                        });

                        fetchPropertyPdfLinks(feature.id, strings.getLanguage())
                            .then((linksRes) => {
                                if (linksRes) {
                                    const linksResApiUrls = {
                                        deed: linksRes.deed,
                                        easement: linksRes.easement,
                                        map: linksRes.map,
                                        registerunit: linksRes.registerunit,
                                    };

                                    dispatch({
                                        type: types.SET_PROPERTY_INFO_LINKS_FULFILLED,
                                        links: linksResApiUrls,
                                        featureId: feature.id,
                                    });
                                } else {
                                    dispatch({
                                        type: types.SET_PROPERTY_INFO_LINKS_REJECTED,
                                        featureId: feature.id,
                                    });
                                }
                            })
                            .catch(error => console.log(error));
                    }
                });
            } else {
                dispatch({
                    type: types.SET_PROPERTY_INFO_REJECTED,
                });
            }
        })
        .catch(error => console.log(error));
};

export const setActiveSearch = (activeSearch: string) => ({
    type: types.SET_ACTIVE_SEARCH,
    activeSearch,
});

export const togglePropertyAreaSearch = () => ({
    type: types.TOGGLE_PROPERTY_AREA_SEARCH,
});
