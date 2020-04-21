import React from 'react';
import { shallow } from 'enzyme';
import MapLayerSettings from '../MapLayerSettings';
import LayerSettings from '../../../../../../ui/blocks/LayerSettings';

describe('<MapLayerSettings />', () => {
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
            onOpacityChange: jest.fn(),
            toggleLayer: jest.fn(),
            setActiveAdminTool: jest.fn(),
            activeAdminTool: jest.fn(),
            createNonSpatialFeature: jest.fn(),
            createThemeLayer: jest.fn(),
            addNonSpatialContentToTable: jest.fn(),
            mapScale: 30000,
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
