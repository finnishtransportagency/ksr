import React from 'react';
import { shallow } from 'enzyme';
import MapLayerToggleIcon from '../MapLayerToggleIcon';

describe('<MapLayerToggleIcon />', () => {
    it('should render', () => {
        const wrapper = shallow(<MapLayerToggleIcon visible={false} />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('icon should be fa-toggle-on', () => {
        const wrapper = shallow(<MapLayerToggleIcon visible={false} />);
        expect(wrapper.find('i.fas.fa-toggle-off').length).toBe(1);
    });

    it('icon should be fa-toggle-off', () => {
        const wrapper = shallow(<MapLayerToggleIcon visible />);
        expect(wrapper.find('i.fas.fa-toggle-on').length).toBe(1);
    });
});
