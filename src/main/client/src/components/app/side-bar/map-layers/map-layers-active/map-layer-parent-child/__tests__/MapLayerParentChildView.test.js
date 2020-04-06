import React from 'react';
import { shallow } from 'enzyme';
import MapLayerParentChildView from '../MapLayerParentChildView';
import LayerSettings from '../../../../../../ui/blocks/LayerSettings';
import MapLayerChildView from '../MapLayerChildView';

describe('<MapLayerParentChildView />', () => {
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
