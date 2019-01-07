// @flow

import esriLoader from 'esri-loader';

/**
 * Create theme layer for given feature layer by setting new ClassBreaksRenderer with given
 * parameters.
 *
 * @param {Object} featureLayer Layer which the theme layer is created for.
 * @param {Object} rendererParams Object containing parameters for creating new ClassBreaksRenderer.
 * @param {string} layerId Layer identifier.
 * @param {Object[]} layerList List of layers.
 * @param {Function} setLayerList Function for setting updated layer list.
 *
 * @returns {Promise} Returns when new renderer has been created.
 */
export const createThemeLayer = async (
    featureLayer: Object,
    rendererParams: Object,
    layerId: string,
    layerList: Object[],
    setLayerList: (Object[]) => void,
) => {
    const [colorRendererCreator] = await esriLoader
        .loadModules(['esri/renderers/smartMapping/creators/color']);
    const response = await colorRendererCreator.createClassBreaksRenderer(rendererParams);
    const newLayerList = layerList.map(layer => ({
        ...layer,
        renderer: layer.id === layerId && !layer.renderer
            ? featureLayer.renderer
            : layer.renderer,
    }));

    featureLayer.renderer = response.renderer;
    featureLayer.legendEnabled = true;

    setLayerList(newLayerList);
};

/**
 * Set default renderer for given layer.
 *
 * @param {Object} featureLayer Layer which renderer is being reset.
 * @param {Object} layer Layer containing the default renderer.
 * @param {Object[]} layerList List of layers.
 * @param {Function} setLayerList Function for setting updated layer list.
 */
export const resetLayerTheme = (
    featureLayer: Object,
    layer: Object,
    layerList: Object[],
    setLayerList: (Object[]) => void,
) => {
    featureLayer.renderer = layer.renderer;
    featureLayer.legendEnabled = false;

    const newLayerList = layerList.map(l => ({
        ...l,
        renderer: l.id === layer.id ? null : l.renderer,
    }));
    setLayerList(newLayerList);
};
