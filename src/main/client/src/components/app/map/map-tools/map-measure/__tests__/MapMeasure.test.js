import React from 'react';
import { shallow } from 'enzyme';
import MapMeasure from '../MapMeasure';
import MapMeasureView from '../MapMeasureView';

const setup = () => {
    const props = {
        draw: {},
    };
    const wrapper = shallow(<MapMeasure {...props} />);

    return { wrapper };
};

describe('<MapMeasure />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapMeasureView).exists()).toBe(true);
    });

    it('should invoke mapMeasure when draw completed', () => {
        const newProps = {
            draw: {
                initialized: true,
            },
        };
        const spy = jest.spyOn(wrapper.instance(), 'mapMeasure');
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(spy).toHaveBeenCalled();
    });
});
