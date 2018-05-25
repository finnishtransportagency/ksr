import React from 'react';
import { shallow } from 'enzyme';
import MapMeasureView from '../MapMeasureView';
import { MeasurementBox } from '../styles';

function setup() {
    const props = {
        value: '522 m',
        active: 'polyline',
    };

    const wrapper = shallow(<MapMeasureView {...props} />);

    return { wrapper, props };
}

describe('<MapMeasureView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#draw-polygon').exists()).toBe(true);
        expect(wrapper.find('#draw-line').exists()).toBe(true);
        expect(wrapper.find(MeasurementBox).exists()).toBe(true);
    });

    it('should render correct values from props', () => {
        expect(wrapper.find(MeasurementBox).find('.esri-icon-polyline').exists()).toBe(true);
        expect(wrapper.find('.value-text').render().text()).toBe('522 m');
    });
});
