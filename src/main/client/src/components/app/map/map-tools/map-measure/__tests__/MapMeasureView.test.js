import React from 'react';
import { shallow } from 'enzyme';
import MapMeasureView from '../MapMeasureView';
import { DrawToolOuterWrapper, DrawToolWrapper } from '../../styles';

const setup = () => {
    const props = {
        value: '522 m',
        active: 'drawPolyline',
    };

    const wrapper = shallow(<MapMeasureView {...props} />);

    return { wrapper, props };
};

describe('<MapMeasureView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#draw-measure-polygon').exists()).toBe(true);
        expect(wrapper.find('#draw-measure-line').exists()).toBe(true);
        expect(wrapper.find(DrawToolOuterWrapper).exists()).toBe(true);
        expect(wrapper.find(DrawToolWrapper).exists()).toBe(true);
    });
});
