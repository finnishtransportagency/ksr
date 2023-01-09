import React from 'react';
import renderer from 'react-test-renderer';
import Checkbox from '../index';

describe.skip('<Checkbox />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Checkbox />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
    it('has correct style rules', () => {
        const wrapper = renderer.create(<Checkbox />).toJSON();
        expect(wrapper).toHaveStyleRule('padding-left', '3rem');
        expect(wrapper).toHaveStyleRule('margin-bottom', '10px');
    });
});
