import React from 'react';
import { shallow } from 'enzyme';
import MapLayerParentChildView from '../MapLayerParentChildView';
import LayerSettings from '../../../../../../ui/blocks/LayerSettings';
import MapLayerChildView from '../MapLayerChildView';

describe.skip('<MapLayerParentChildView />', () => {
    const setup = (layerParams = {}) => {
        const props = {
            layer: {
                ...layerParams,
            },
            layerList: [
                { id: '1', parentLayer: null },
                { id: '2', parentLayer: '1' },
                { id: '3', parentLayer: '1' },
                { id: '4', parentLayer: '1' },
            ],
            tableLayers: [
                {
                    id: '1', name: 'Layer 1', active: true, visible: true,
                },
                {
                    id: '2', name: 'Layer 2', active: false, visible: false,
                },
                {
                    id: '3', name: 'Layer 3', active: true, visible: false,
                },
                {
                    id: '4', name: 'Layer 4', active: true, visible: true,
                },
            ],
            toggleLayer: jest.fn(),
            onOpacityChange: jest.fn(),
            activeAdminTool: '',
            createThemeLayer: jest.fn(),
            mapScale: 30000,
            handleAdminModeChange: jest.fn(),
        };
        return {
            wrapper: shallow(<MapLayerParentChildView {...props} />),
            props,
        };
    };

    it('render - should contain one (1) LayerSettings', () => {
        const layerParams = { id: '1', parentLayer: null };
        const { wrapper } = setup(layerParams);

        expect(wrapper.find(LayerSettings).length).toBe(1);
        expect(wrapper.find(LayerSettings.Content).length).toBe(1);
        expect(wrapper.find(LayerSettings.ContentMain).length).toBe(1);
    });

    it('render - should not render LayerSettings for childLayer', () => {
        const layerParams = { id: '2', parentLayer: '1' };
        const { wrapper } = setup(layerParams);

        expect(wrapper.find(LayerSettings).length).toBe(0);
    });

    it('render - should contain all related child layer views', () => {
        const layer = { id: '1', parentLayer: null };
        const { wrapper } = setup(layer);

        expect(wrapper.find(MapLayerChildView).length).toBe(3);
    });
});
