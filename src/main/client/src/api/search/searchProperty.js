// @flow
import querystring from 'querystring';
import { config } from '../config';

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
            .then(res => (res.ok ? res.json() : null))
            .catch(err => console.log(err));
    }

    return fetch(`api/property/${queryParameter}`, config())
        .then(res => (res.ok ? res.json() : null))
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
        .then(res => (res.ok ? res.json() : null))
        .catch(err => console.log(err))
);
