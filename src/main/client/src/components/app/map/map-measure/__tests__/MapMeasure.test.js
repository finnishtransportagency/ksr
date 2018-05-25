import React from 'react';
import { shallow } from 'enzyme';
import MapMeasure from '../MapMeasure';
import MapMeasureView from '../MapMeasureView';

function setup() {
    const props = {
        view: {},
    };
    const wrapper = shallow(<MapMeasure {...props} />);

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

    it('should remove measurement data from state', () => {
        wrapper.setState({
            value: '544 m',
            active: 'polyline',
            draw: {
                reset: () => {},
            },
            view: {
                graphics: [],
            },
        });
        wrapper.instance().removeMeasurement();
        expect(wrapper.state('value')).toBe('');
        expect(wrapper.state('active')).toBe('');
    });
});
