// @flow
// import { loadModules } from 'esri-loader';
import * as symbolUtils from '@arcgis/core/symbols/support/symbolUtils';

/**
 * Get legend symbol.
 *
 * @param {Object} symbol Layer symbol.
 * @returns {Promise} Promise html element that contains legend symbol.
 */
export const getLegendSymbol = async (symbol: Object): Promise<any> => symbolUtils.renderPreviewHTML(symbol, {
    size: 12,
});

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
                const uniqueSymbols = [];
                for (let idx = 0; idx < fl.renderer.uniqueValueInfos.length; idx += 1) {
                    uniqueSymbols.push({
                        // eslint-disable-next-line no-await-in-loop
                        symbol: await getLegendSymbol(fl.renderer.uniqueValueInfos[idx]
                            .symbol.clone()),
                        label: fl.renderer.uniqueValueInfos[idx].label,
                    });
                }
                layer.uniqueSymbols = uniqueSymbols;
            }
        }
    } else if (layer.type === 'wms' && layer.wmsLegend) {
        const symbol: HTMLImageElement = document.createElement('img');
        symbol.src = `${layer.url}?request=GetLegendGraphic&layer=${layer.layers}&format=image/png&version=1.3.0`;
        layer.uniqueSymbols = [{ symbol }];
    }
};
