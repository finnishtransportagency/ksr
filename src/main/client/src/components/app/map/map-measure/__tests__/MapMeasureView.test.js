import React from 'react';
import { shallow } from 'enzyme';
import MapMeasureView from '../MapMeasureView';

function setup() {
    const props = {
        value: '',
    };

    const wrapper = shallow(<MapMeasureView {...props} />);

    return { wrapper, props };
}

describe('<MapMeasureView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#draw-polygon').exists()).toBe(true);
        expect(wrapper.find('#draw-line').exists()).toBe(true);
        expect(wrapper.find('#measurement').exists()).toBe(true);
    });
});
