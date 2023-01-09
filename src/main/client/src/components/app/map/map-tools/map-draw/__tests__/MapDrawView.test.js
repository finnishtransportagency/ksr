import React from 'react';
import { shallow } from 'enzyme';
import MapDrawView from '../MapDrawView';
import { DrawToolOuterWrapper, DrawToolWrapper } from '../../styles';

const setup = () => {
    const props = {
        hasGraphics: true,
        active: 'drawPolyline',
    };

    const wrapper = shallow(<MapDrawView {...props} />);

    return { wrapper, props };
};

describe.skip('<MapDrawView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#draw-polygon').exists()).toBe(true);
        expect(wrapper.find('#draw-line').exists()).toBe(true);
        expect(wrapper.find(DrawToolOuterWrapper).exists()).toBe(true);
        expect(wrapper.find(DrawToolWrapper).exists()).toBe(true);
    });
});
