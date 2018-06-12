import React from 'react';
import renderer from 'react-test-renderer';
import SideBar from '../index';

describe('<SideBar />', () => {
    it('works', () => {
        const wrapper = renderer.create(<SideBar />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders visible', () => {
        const wrapper = renderer.create(<SideBar active="search" />).toJSON();
        expect(wrapper).toHaveStyleRule('visibility', 'visible');
        expect(wrapper).toHaveStyleRule('left', '60px');
    });

    it('renders hidden', () => {
        const wrapper = renderer.create(<SideBar />).toJSON();
        expect(wrapper).toHaveStyleRule('visibility', 'hidden');
        expect(wrapper).toHaveStyleRule('left', '-400px');
    });
});
