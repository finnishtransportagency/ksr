// @flow
import { toast } from 'react-toastify';

/**
 * Fetch request headers.
 *
 * @param {string} contentType Header's Content type.
 */
const getHeaders = (contentType: string) => {
    const headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', `application/${contentType}; charset=utf-8`);
    return headers;
};

/**
 * Fetch request config.
 *
 * @param {string} [contentType=json] Header's content type.
 */
export const config = (contentType?: string = 'json'): any => ({
    headers: getHeaders(contentType),
    credentials: 'include',
    mode: 'cors',
});

/**
 * Handles fetch error with throwing error or continuing promise chain.
 *
 * @param {Object} response Response from fetch.
 * @param {string} [toastText] Text to be shown in error toast notification.
 *
 * @throws Will throw an error if response is not ok.
 * @returns {Promise} Promise with response data.
 */
export const handleErrors = (response: Object, toastText?: string): any => {
    if (!response.ok) {
        if (toastText) toast.error(toastText);
        throw Error(response.statusText);
    }
    return response;
};
