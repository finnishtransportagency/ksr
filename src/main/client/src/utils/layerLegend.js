// @flow
import esriLoader from 'esri-loader';

/**
 * Render layer legend previews for given layers.
 *
 * @param {Object[]} layerList List of layers.
 * @param {Object} view Esri map view.
 *
 * @returns {Promise} Promise object that contains updated layerList with legend symbols.
 */
export const getLayerLegend = async (
    layerList: Object[],
    view: Object,
) => {
    const [symbolPreview] = await esriLoader
        .loadModules(['esri/symbols/support/symbolPreview']);

    return Promise.all(layerList.map(l => ({ ...l }))
        .map(async (l) => {
            if (l.type === 'agfs' && l.active && !l.legendSymbol) {
                const fl = view.map.findLayerById(l.id);
                if (fl && fl.renderer) {
                    const setLegendSymbol = async (symbol: Object) => {
                        l.legendSymbol = await symbolPreview.renderPreviewHTML(symbol, {
                            size: 12,
                        });
                    };
                    if (fl.renderer.symbol) {
                        const symbol = fl.renderer.symbol.clone();
                        await setLegendSymbol(symbol);
                    } else if (fl.renderer.uniqueValueInfos) {
                        // Select first symbol if layer has multiple legends.
                        const symbol = fl.renderer.uniqueValueInfos[0].symbol.clone();
                        await setLegendSymbol(symbol);
                    }
                }
            }
            return l;
        }));
};
