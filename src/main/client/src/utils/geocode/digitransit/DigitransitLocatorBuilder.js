import Point from '@arcgis/core/geometry/Point';
import SearchSource from '@arcgis/core/widgets/Search/SearchSource';
import Graphic from '@arcgis/core/Graphic';

import { fetchAddresses } from './api';
import strings from '../../../translations';

// Search source to replace DigiTransitLocator

export const searchSrc = new SearchSource({
    placeholder: strings.geocode.placeholder,
    getResults: async (x) => {
        console.log(x);
        const {
            maxResults, suggestResult: { text },
        } = x;
        const result = await fetchAddresses(text, maxResults);

        if (result[0]) {
            const point = new Point(result[0].location);

            const graphic = new Graphic({
                geometry: point,
                attributes: {
                    name: result[0].text,
                },
            });

            return [{
                extent: null,
                feature: graphic,
                name: result[0].text,
            }];
        }
        return [];
    },
    getSuggestions: async (x) => {
        const {
            maxResults, sourceIndex, suggestTerm,
        } = x;
        const result = await fetchAddresses(suggestTerm, maxResults);
        return result.map((r) => ({
            key: 'text',
            text: r.text,
            sourceIndex,
        }));
    },
});
