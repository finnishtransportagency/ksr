import React from 'react';
import { shallow } from 'enzyme';
import MapTools from '../MapTools';
import SketchToolContainer from '../sketch-tools/SketchToolContainer';

const setup = () => {
    const props = {
        activeNav: '',
        view: {},
        isOpenTable: false,
    };
    const wrapper = shallow(<MapTools {...props} />);

    return { props, wrapper };
};

describe.skip('<MapTools />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SketchToolContainer).exists()).toBe(true);
    });
});
