// @flow
import { config } from '../config';
import strings from '../../translations';

/**
 * Get layer group data from database.
 *
 * @returns {Promise<Object[]>} Promise with layer group data.
 */
export const fetchLayerGroups = () => (
    fetch('api/layergroup', config())
        .then(r => r.json())
        .then(layerGroups => layerGroups.map(lg => (
            {
                ...lg,
                layers: lg.layers.map(l => ({
                    ...l,
                    active: l.visible,
                    failOnLoad: false,
                })),
            }
        )))
        .then((layerGroups) => {
            if (layerGroups.length > 0) {
                const maxId = Math.max(...layerGroups.map(lg => lg.id));
                const maxOrder = Math.max(...layerGroups.map(lg => lg.groupOrder));
                if (Number.isInteger(maxId) && Number.isInteger(maxOrder)) {
                    // Create a new LayerGroup holding searchresults
                    layerGroups.push({
                        id: maxId + 1,
                        groupOrder: maxOrder + 1,
                        name: strings.search.searchLayerGroupName,
                        layers: [],
                        type: 'search',
                    });
                }
            }
            return layerGroups;
        })
);
