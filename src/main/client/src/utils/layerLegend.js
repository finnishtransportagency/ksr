// @flow
import esriLoader from 'esri-loader';

/**
 * Get legend symbol.
 *
 * @param {Object} symbol Layer symbol.
 * @returns {Promise} Promise html element that contains legend symbol.
 */
export const getLegendSymbol = async (symbol: Object) => {
    const [symbolPreview] = await esriLoader
        .loadModules(['esri/symbols/support/symbolPreview']);
    return symbolPreview.renderPreviewHTML(symbol, {
        size: 12,
    });
};

/**
 * Render layer legend previews for given layers.
 *
 * @param {Object} layer List of layers.
 * @param {Object} view Esri map view.
 */
export const setLayerLegend = async (
    layer: Object,
    view: Object,
) => {
    if ((layer.type === 'agfs' || layer.type === 'feature') && (!layer.legendSymbol)) {
        const fl = view.map.findLayerById(layer.id);
        if (fl && fl.renderer) {
            if (fl.renderer.symbol) {
                const symbol = fl.renderer.symbol.clone();
                layer.legendSymbol = await getLegendSymbol(symbol);
            } else if (fl.renderer.uniqueValueInfos) {
                // Select first symbol if layer has multiple legends.
                const symbol = fl.renderer.uniqueValueInfos[0].symbol.clone();
                layer.legendSymbol = await getLegendSymbol(symbol);
            }
        }
    }
};
