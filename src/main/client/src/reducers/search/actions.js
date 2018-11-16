// @flow
import { fetchPropertyInfo, fetchPropertyPdfLinks } from '../../api/search/searchProperty';
import * as types from '../../constants/actionTypes';
import strings from '../../translations';
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

    fetchPropertyInfo(queryParameters)
        .then((property) => {
            if (property.features.length) {
                drawPropertyArea(view, property.features[0].geometry.coordinates);

                dispatch({
                    type: types.SET_PROPERTY_INFO_FULFILLED,
                    id: property.features[0].id,
                    properties: property.features[0].properties,
                    geometry: property.features[0].geometry,
                });

                dispatch({
                    type: types.SET_PROPERTY_INFO_LINKS,
                });

                const allowedUsers = ['KSR_ROLE_ADMIN', 'KSR_ROLE_UPDATER', 'KSR_ROLE_NAMED_USER'];
                const hasPermission = authorities
                    .find(auth => allowedUsers.includes(auth.authority));

                if (hasPermission) {
                    fetchPropertyPdfLinks(property.features[0].id, strings.getLanguage())
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
                                });
                            } else {
                                dispatch({
                                    type: types.SET_PROPERTY_INFO_LINKS_REJECTED,
                                });
                            }
                        });
                } else {
                    dispatch({
                        type: types.SET_PROPERTY_INFO_LINKS_REJECTED,
                    });
                }
            } else {
                dispatch({
                    type: types.SET_PROPERTY_INFO_REJECTED,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: types.SET_PROPERTY_INFO_REJECTED,
            });
        });
};

export const setActiveSearch = (activeSearch: string) => ({
    type: types.SET_ACTIVE_SEARCH,
    activeSearch,
});
