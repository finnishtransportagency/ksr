import React from 'react';
import { shallow } from 'enzyme';

import MapLayerTitle from '../MapLayerTitle';

describe('<MapLayerTitle />', () => {
    it('renders correctly with search layer and name', () => {
        const props = {
            layer: { _source: 'search', name: 'L1' },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('i').length).toBe(1);
        expect(wrapper.find('.fa-search').length).toBe(1);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });

    it('renders correctly with shapefile layer and name', () => {
        const props = {
            layer: { _source: 'shapefile', name: 'L2' },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('i').length).toBe(1);
        expect(wrapper.find('.fa-file').length).toBe(1);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });

    it('renders correctly with user layer', () => {
        const props = {
            layer: { name: 'UL1', userLayer: true },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('i').length).toBe(1);
        expect(wrapper.find('.fa-user').length).toBe(1);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });

    it('renders correctly with contract layer', () => {
        const props = {
            layer: { type: 'agfl', name: 'L3' },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('i').length).toBe(1);
        expect(wrapper.find('.fa-table').length).toBe(1);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });

    it('renders correctly with default layer', () => {
        const props = {
            layer: { name: 'L4' },
        };
        const wrapper = shallow(<MapLayerTitle {...props} />);
        expect(wrapper.find('i').length).toBe(0);
        expect(wrapper.find('span').text()).toBe(props.layer.name);
    });
});
