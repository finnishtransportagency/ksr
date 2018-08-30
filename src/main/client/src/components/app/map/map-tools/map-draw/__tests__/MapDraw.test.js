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

describe('<MapDraw />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(MapDrawView).exists()).toBe(true);
    });

    it('should invoke mapDraw when draw completed', () => {
        const newProps = {
            draw: {
                initialized: true,
            },
        };
        const spy = jest.spyOn(wrapper.instance(), 'mapDraw');
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(spy).toHaveBeenCalled();
    });
});
