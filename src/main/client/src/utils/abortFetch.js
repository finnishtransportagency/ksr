// @flow
const { AbortController } = window;

/**
 * Aborts pending fetch request and returns new controller and signal.
 * Only used for browsers that support AbortController feature.
 *
 * @param {any} controller Controller to be aborted.
 *
 * @returns {Object} Object with controller and signal.
 */
export const abortFetch = (controller: any): { controller: any, signal: any, ... } | { controller: any, signal: void, ... } => {
    if (controller !== undefined) controller.abort();

    if ('AbortController' in window) {
        const abortController = new AbortController();
        return {
            controller: abortController,
            signal: abortController.signal,
        };
    }

    return {
        controller,
        signal: undefined,
    };
};
