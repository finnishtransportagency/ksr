// @flow
import esriLoader from 'esri-loader';

/**
 * Render layer legend previews for given layers.
 *
 * @param {Object} layer List of layers.
 * @param {Object} view Esri map view.
 *
 * @returns {Promise} Promise object that contains updated layer with legend symbol.
 */
export const getLayerLegend = async (
    layer: Object,
    view: Object,
) => {
    const [symbolPreview] = await esriLoader
        .loadModules(['esri/symbols/support/symbolPreview']);

    if (layer.type === 'agfs' && !layer.legendSymbol) {
        const fl = view.map.findLayerById(layer.id);
        if (fl && fl.renderer) {
            const setLegendSymbol = async (symbol: Object) => {
                layer.legendSymbol = await symbolPreview.renderPreviewHTML(symbol, {
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
    return layer;
};
