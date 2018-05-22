import { shallow } from 'enzyme';
import React from 'react';
import SideNav from '../index';

describe('<SideNav />', () => {
    it('works', () => {
        const wrapper = shallow(<SideNav />);
        expect(wrapper).toMatchSnapshot();
    });
});
