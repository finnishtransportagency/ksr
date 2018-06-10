import React from 'react';
import { shallow } from 'enzyme';
import MapLayers from '../MapLayers';
import MapLayersView from '../MapLayersView';

const setup = () => {
    const props = {
        setActiveLayerTab: () => {},
        activeTab: '',
    };
    const wrapper = shallow(<MapLayers {...props} />);

    return { props, wrapper };
};

describe('<MapLayers />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapLayersView).exists()).toBe(true);
    });
});
