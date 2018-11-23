// @flow
import { toast } from 'react-toastify';

export const getHeaders = () => {
    const headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers;
};

export const config = () => ({
    headers: getHeaders(),
    credentials: 'include',
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
export const handleErrors = (response: Object, toastText?: string) => {
    if (!response.ok) {
        if (toastText) toast.error(toastText);
        throw Error(response.statusText);
    }
    return response;
};
