// @flow
import querystring from 'querystring';
import { toast } from 'react-toastify';
import strings from '../../translations/fi';
import { config, handleErrors } from '../config';

/**
 * Finds property info with X and Y coordinates or property identifier.
 *
 * @param {Object | string} queryParameter Parameters to be used in query.
 * Can be either X and Y coordinates, string made from area geometry or property identifier.
 * @param {any} signal Abortcontroller signal.
 *
 * @returns {Promise<Object>} Promise with property info data.
 */
export const fetchPropertyInfo = (queryParameter: any, signal: any): Object => {
    if (queryParameter.x && queryParameter.y) {
        return fetch(`api/property/?${
            querystring.stringify({
                x: queryParameter.x,
                y: queryParameter.y,
            })
        }`, { ...config(), signal })
            .then(res => handleErrors(res, strings.searchProperty.errorToast.searchFailed))
            .then(res => res.json())
            .then((res) => {
                if (!res.features.length) {
                    toast.error(strings.searchProperty.errorToast.searchCoordsNoResults);
                }
                return res;
            });
    }

    if (queryParameter.polygon) {
        return fetch('api/property/', {
            ...config(),
            method: 'POST',
            body: JSON.stringify({ polygon: queryParameter.polygon }),
            signal,
        })
            .then(res => handleErrors(res, strings.searchProperty.errorToast.searchFailed))
            .then(res => res.json())
            .then((res) => {
                if (!res.features.length) {
                    toast.error(strings.searchProperty.errorToast.searchCoordsNoResults);
                }
                return res;
            });
    }

    return fetch(`api/property/${queryParameter}`, { ...config(), signal })
        .then(res => handleErrors(res, strings.searchProperty.errorToast.searchFailed))
        .then(res => res.json())
        .then((res) => {
            if (!res.features.length) {
                toast.error(strings.searchProperty.errorToast.searchIdNoResults);
            }
            return res;
        })
        .catch(err => console.error(err));
};

/**
 * Gets all the PDF document links connected to a property.
 *
 * @param {string} propertyIdentifier Property's identifier.
 * @param {string} language Language for the documents.
 *
 * @returns {Promise<Object>} Promise with PDF document link urls.
 */
export const fetchPropertyPdfLinks = (propertyIdentifier: string, language: string): Promise<mixed> => (
    fetch(`api/property/pdf/links/?${
        querystring.stringify({ propertyIdentifier, language })
    }`, config())
        .then(res => handleErrors(res, strings.searchProperty.errorToast.searchLinksFailed))
        .then(res => res.json())
);
