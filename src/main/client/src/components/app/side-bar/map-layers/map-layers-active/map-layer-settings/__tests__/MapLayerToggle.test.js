import React from 'react';
import { shallow } from 'enzyme';
import MapLayerToggle from '../MapLayerToggle';
import strings from '../../../../../../../translations';
import MapLayerToggleIcon from '../MapLayerToggleIcon';

describe('<MapLayerToggle />', () => {
    const setup = (mapScale, legendSymbol) => {
        const props = {
            layer: {
                visible: true,
                id: 2,
                minScale: 50000,
                maxScale: 500,
                legendSymbol: legendSymbol || null,
            },
            mapScale: mapScale || 1500,
            onToggleVisibility: jest.fn(),
        };
        const wrapper = shallow(<MapLayerToggle {...props} />);
        return { wrapper, props };
    };

    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should return icon indicating layer not visible', () => {
        const { wrapper } = setup(200);
        expect(wrapper.find('i.fas.fa-eye-slash').length).toBe(1);
    });

    it('should return icon indicating layer not visible', () => {
        const { wrapper } = setup(10 ** 5);
        expect(wrapper.find('i.fas.fa-eye-slash').length).toBe(1);
    });

    it('should have title indicating layer not visible', () => {
        const { wrapper } = setup(200);
        expect(wrapper.find(`[title="${strings.mapLayerSettings.zoomOut}"]`).length).toBe(1);
    });

    it('should have title indicating layer not visible', () => {
        const { wrapper } = setup(200000);
        expect(wrapper.find(`[title="${strings.mapLayerSettings.zoomIn}"]`).length).toBe(1);
    });

    it('should have <MapLayerToggleIcon /> and no symbol', () => {
        const { wrapper } = setup();
        expect(wrapper.find(MapLayerToggleIcon).length).toBe(1);
    });

    it('should have both <MapLayerToggleIcon /> and symbol', () => {
        const { wrapper } = setup(1000, document.createElement('div'));
        expect(wrapper.find(MapLayerToggleIcon).length).toBe(1);
        expect(wrapper.find('div.symbolWrapper').length).toBe(1);
    });
});
