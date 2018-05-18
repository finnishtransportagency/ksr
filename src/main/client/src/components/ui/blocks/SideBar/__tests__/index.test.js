import { shallow } from 'enzyme';
import React from 'react';
import SideBar from '../index';

describe('<SideBar />', () => {
    it('works', () => {
        const wrapper = shallow(<SideBar />);
        expect(wrapper).toMatchSnapshot();
    });
});
