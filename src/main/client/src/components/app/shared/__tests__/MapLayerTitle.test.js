import React from 'react';
import { shallow } from 'enzyme';

import MapLayerTitle from '../MapLayerTitle';

describe('<MapLayerTitle />', () => {
    it('renders correctly with search layer and name', () => {
        const props = {
            layer: { _source: 'search', name: 'L1' },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('.fa-search').length).toBe(1);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });

    it('renders correctly with user layer', () => {
        const props = {
            layer: { name: 'UL1', userLayer: true },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('.fa-user').length).toBe(1);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });
});
