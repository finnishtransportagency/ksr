import React from 'react';
import { shallow } from 'enzyme';
import MapDraw from '../MapDraw';
import MapDrawView from '../MapDrawView';

const setup = () => {
    const props = {
        draw: {},
    };
    const wrapper = shallow(<MapDraw {...props} />);

    return { wrapper };
};

describe.skip('<MapDraw />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapDrawView).exists()).toBe(true);
    });
});
