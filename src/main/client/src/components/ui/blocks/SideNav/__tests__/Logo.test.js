import React from 'react';
import renderer from 'react-test-renderer';
import Logo from '../Logo';

describe.skip('<Logo />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Logo />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
