import React from 'react';
import { shallow } from 'enzyme';
import MapLayerSettings from '../MapLayerSettings';
import LayerSettings from '../../../../../../ui/blocks/LayerSettings';

describe.skip('<MapLayerSettings />', () => {
    const setup = (type, visible) => {
        const props = {
            layer: {
                type,
                name: 'Test layer',
                visible,
                minScale: 1000,
                maxScale: 50000,
                layerPermission: {},
            },
            layerList: [],
            loadingLayers: [],
            onOpacityChange: jest.fn(),
            toggleLayer: jest.fn(),
            setActiveAdminTool: jest.fn(),
            activeAdminTool: jest.fn(),
            createNonSpatialFeature: jest.fn(),
            createThemeLayer: jest.fn(),
            populateTable: jest.fn(),
            mapScale: 30000,
        };
        return {
            wrapper: shallow(<MapLayerSettings {...props} />),
            props,
        };
    };

    it('should render', () => {
        const { wrapper } = setup('agfs', true);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should contain <LayerSettings /> if layer is visible', () => {
        const { wrapper } = setup('agfs', true);
        expect(wrapper.find(LayerSettings).length).toBe(1);
    });

    it('should contain <LayerSettings /> if layer is not visible', () => {
        const { wrapper } = setup('agfs', false);
        const layerSettings = wrapper.find(LayerSettings);
        expect(layerSettings.length).toBe(1);
        const { toggledHidden } = layerSettings.first().props();
        expect(toggledHidden).toBeTruthy();
    });
});
