import React from 'react';
import { shallow } from 'enzyme';
import MapMeasure from '../MapMeasure';
import MapMeasureView from '../MapMeasureView';

function setup() {
    const wrapper = shallow(<MapMeasure />);

    return { wrapper };
}

describe('<MapMeasure />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapMeasureView).exists()).toBe(true);
    });

    it('should invoke mapMeasure when prop received', () => {
        const view = {};
        const spy = jest.spyOn(wrapper.instance(), 'mapMeasure');
        wrapper.instance().componentWillReceiveProps(view);
        expect(spy).toHaveBeenCalled();
    });

    it('should remove measurement value', () => {
        const view = {
            graphics: {
                removeAll: () => {},
            },
        };
        wrapper.setState({ value: '544 m' });
        wrapper.instance().removeMeasurement(view);
        expect(wrapper.state('value')).toBe('');
    });
});
