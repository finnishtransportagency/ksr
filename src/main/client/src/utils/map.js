// @flow
import esriLoader from 'esri-loader';

export const addLayer = (layer: Object, view: Object, index: number) => {
    esriLoader
        .loadModules([
            'esri/config',
            'esri/layers/WMSLayer',
            'esri/layers/WMTSLayer',
            'esri/layers/FeatureLayer',
        ])
        .then(([
            esriConfig,
            WMSLayer,
            WMTSLayer,
            FeatureLayer,
        ]) => {
            esriConfig.request.corsEnabledServers.push(layer.url);

            switch (layer.type) {
                case 'wms':
                    view.map.add(new WMSLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        opacity: layer.opacity,
                        visible: layer.visible,
                        sublayers: [
                            {
                                name: layer.layers,
                            },
                        ],
                    }), index);
                    break;
                case 'wmts':
                    view.map.add(new WMTSLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        opacity: layer.opacity,
                        visible: layer.visible,
                        activeLayer: {
                            id: layer.layers,
                        },
                    }), index);
                    break;
                case 'agfs':
                    view.map.add(new FeatureLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        opacity: layer.opacity,
                        visible: layer.visible,
                        outFields: ['*'],
                    }), index);
                    break;
                default:
                    break;
            }
        });
};
