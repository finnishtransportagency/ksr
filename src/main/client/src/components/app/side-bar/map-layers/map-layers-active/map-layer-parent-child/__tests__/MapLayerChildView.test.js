import React from 'react';
import { shallow } from 'enzyme';
import MapLayerChildView from '../MapLayerChildView';
import LayerSettings from '../../../../../../ui/blocks/LayerSettings';

describe.skip('<MapLayerChildView />', () => {
    const setup = (fields = []) => {
        const props = {
            layer: {
                name: 'Test layer',
                fields,
            },
            loadingLayers: [],
            toggleLayer: jest.fn(),
            onOpacityChange: jest.fn(),
            createThemeLayer: jest.fn(),
            populateTable: jest.fn(),
            mapScale: 30000,
        };
        return {
            wrapper: shallow(<MapLayerChildView {...props} />),
            props,
        };
    };

    it('render - should contain one (1) LayerSettings', () => {
        const { wrapper } = setup();

        expect(wrapper.find(LayerSettings).length).toBe(1);
        expect(wrapper.find(LayerSettings.Content).length).toBe(1);
        expect(wrapper.find(LayerSettings.ContentMain).length).toBe(1);
    });

    it('theme layer icon - should be visible', () => {
        const fields = [{ name: 'numberField', type: 'esriFieldTypeInteger' }];
        const { wrapper } = setup(fields);

        expect(wrapper.find(LayerSettings.Icons).length).toBe(2);
        expect(wrapper.find(LayerSettings.Icon).length).toBe(1);
    });

    it('theme layer icon - should be hidden', () => {
        const fields = [{ name: 'textField', type: 'esriFieldTypeString' }];
        const { wrapper } = setup(fields);

        expect(wrapper.find(LayerSettings.Icons).length).toBe(2);
        expect(wrapper.find(LayerSettings.Icon).length).toBe(0);
    });
});
