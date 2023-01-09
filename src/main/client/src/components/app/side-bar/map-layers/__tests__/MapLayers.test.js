import React from 'react';
import { shallow } from 'enzyme';
import MapLayers from '../MapLayers';
import MapLayersView from '../MapLayersView';

const setup = () => {
    const props = {
        setActiveLayerTab: () => {},
        activeTab: '',
        layerGroups: {
            layerGroups: [{}],
            layerList: [{}],
        },
    };
    const wrapper = shallow(<MapLayers {...props} />);

    return { props, wrapper };
};

describe.skip('<MapLayers />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapLayersView).exists()).toBe(true);
    });

    it('should handle handleInputChange correctly', () => {
        wrapper.setState({ layersToFind: '' });
        expect(wrapper.state('layersToFind')).toEqual('');

        const evt = {
            target: {
                name: 'layersToFind',
                value: 'layer',
            },
        };

        wrapper.instance().handleInputChange(evt);
        expect(wrapper.state('layersToFind')).toEqual('layer');
    });
});
