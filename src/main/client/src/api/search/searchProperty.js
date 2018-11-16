// @flow
import querystring from 'querystring';
import { toast } from 'react-toastify';
import strings from '../../translations/fi';
import { config, handleErrors } from '../config';

/**
 * Finds property info with X and Y coordinates or property identifier.
 *
 * @param {Object | string} queryParameter Parameters to be used in query.
 * Can be either X and Y coordinates or property identifier.
 *
 * @returns {Promise} Promise with property info.
 */
export const fetchPropertyInfo = (queryParameter: any): Object => {
    if (queryParameter.x && queryParameter.y) {
        return fetch(`api/property/?${
            querystring.stringify({
                x: queryParameter.x,
                y: queryParameter.y,
            })
        }`, config())
            .then(res => handleErrors(res, strings.searchProperty.errorToast.searchFailed))
            .then(res => res.json())
            .then((res) => {
                if (!res.features.length) {
                    toast.error(strings.searchProperty.errorToast.searchCoordsNoResults);
                }
                return res;
            })
            .catch(err => console.log(err));
    }

    return fetch(`api/property/${queryParameter}`, config())
        .then(res => handleErrors(res, strings.searchProperty.errorToast.searchFailed))
        .then(res => res.json())
        .then((res) => {
            if (!res.features.length) {
                toast.error(strings.searchProperty.errorToast.searchIdNoResults);
            }
            return res.json();
        })
        .catch(err => console.log(err));
};

/**
 * Gets all the PDF document links connected to a property.
 *
 * @param {string} propertyIdentifier Propertys identifier.
 * @param {string} language Language for the documents.
 *
 * @returns {Promise} Promise with PDF document link urls.
 */
export const fetchPropertyPdfLinks = (propertyIdentifier: string, language: string) => (
    fetch(`api/property/pdf/links/?${
        querystring.stringify({ propertyIdentifier, language })
    }`, config())
        .then(res => handleErrors(res, strings.searchProperty.errorToast.searchLinksFailed))
        .then(res => res.json())
        .catch(err => console.log(err))
);
