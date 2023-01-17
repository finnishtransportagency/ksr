// @flow
// import { loadModules } from 'esri-loader';

import { addressToLocations, suggestLocations } from '@arcgis/core/rest/locator';

import * as promiseUtils from '@arcgis/core/core/promiseUtils';

/* import { fetchAddresses } from './api';
import cache, { addToCache } from './cache'; */

/**
 * A Builder that asynchronously builds a DigitransitLocator that is a subClass of
 * esri.tasks.Locator.
 *
 * @returns {Object} Object that has a build method to build a DigitransitLocator.
 */
class DigitransitLocator {
    constructor() {
        this.addressToLocations = addressToLocations;
        this.suggestLocations = suggestLocations;
        this.cancellablePromise = (promise: Promise<any>) => promiseUtils
            .create((resolve, reject) => {
                promise.then(resolve).catch(reject);
            });
    }
}

/* const DigitransitLocatorBuilder = {

    /!**
     * Builds a DigitransitLocator class that is Subclass of 'esri.tasks.Locator'.
     *
     * @returns {Promise<Object>} Promise that will resolve to DigitransitLocator.
     *!/
    Build: async () => {
        /!* const [Locator] = await loadModules([
            'esri/tasks/Locator',
        ]); *!/

        /!**
         * Creates a ArcGIS JS API 4 compatible Promise.
         *
         * ArcGIS JS API expects that Promise can be cancelled using .cancel() -method,
         * which is not part of the Promise-spec.
         *
         * @param {Promise<any>} promise Promise to wrap inside.
         * @returns {Promise<any>} Promise that conforms ArcGIS JS API requirements.
         *!/
        const cancellablePromise = (promise: Promise<any>) => promiseUtils
            .create((resolve, reject) => {
                promise.then(resolve).catch(reject);
            });

        /!**
         * A Custom esri.tasks.Locator that geocodes addresses using Digitransit geocoding api.
         *
         * @see {@link https://digitransit.fi/en/developers/apis/2-geocoding-api/address-search/} For API-usage.
         *!/

        const DigitransitLocator = {
            cancellablePromise,
            addressToLocations,
            suggestLocations,
        };

        /!* const DigitransitLocator = Locator.createSubclass({
            declaredClass: 'esri.tasks.Locator.DigitransitLocator',
            outSpatialReference: { wkid: 3067 },

            /!**
             * Geocodes an address into a location using Digitransit geocode service.
             *
             * @override Overrides method from esri.tasks.Locator.
             *
             * @param {Object} address Object defining user given address.
             * @param {number} maxLocations Max number of locations to return.
             * @param {string} magicKey Id of the selected suggested location.
             * @return {Promise<Object[]>} Promise with geocoding results.
             *!/
            addressToLocations: ({ address, maxLocations, magicKey }) => {
                if (magicKey && cache.has(magicKey)) {
                    return cancellablePromise(Promise.resolve([cache.get(magicKey)]));
                }
                const text = address['Single Line Input'];
                return cancellablePromise(fetchAddresses(text, maxLocations));
            },

            /!**
             * Geocodes text into geocoding suggestions.
             *
             * @override Overrides method from esri.tasks.Locator.
             *
             * @param {string} text User input to geocode into suggestions.
             * @param {number} maxSuggestions Max number of suggestions to return.
             * @returns {Promise<Object[]>} Promise with suggestions.
             *!/
            suggestLocations: ({ text, maxSuggestions }) => {
                const promise = fetchAddresses(text, maxSuggestions).then(addToCache);
                return cancellablePromise(promise);
            },
        }); *!/

        return DigitransitLocator;
    },
}; */

export default DigitransitLocator;
