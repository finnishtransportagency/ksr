import React from 'react';
import renderer from 'react-test-renderer';
import SideNav from '../index';

describe.skip('<SideNav />', () => {
    it('works', () => {
        const wrapper = renderer.create(<SideNav />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
