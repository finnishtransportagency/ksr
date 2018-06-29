import React from 'react';
import { shallow } from 'enzyme';
import SketchToolView from '../SketchToolView';

const setup = () => {
    const wrapper = shallow(<SketchToolView />);

    return { wrapper };
};

describe('<SketchToolView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#draw-rectangle').exists()).toBe(true);
        expect(wrapper.find('#remove-selection').exists()).toBe(true);
    });
});
