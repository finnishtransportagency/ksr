import { shallow } from 'enzyme';
import React from 'react';
import Logo from '../Logo';

describe('<Logo />', () => {
    it('works', () => {
        const wrapper = shallow(<Logo />);
        expect(wrapper).toMatchSnapshot();
    });
});
