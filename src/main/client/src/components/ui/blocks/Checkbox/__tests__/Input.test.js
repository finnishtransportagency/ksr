import React from 'react';
import renderer from 'react-test-renderer';
import Input from '../Input';

describe('<Checkbox.Input />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Input />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Input />).toJSON();
        expect(wrapper).toHaveStyleRule('opacity', '0');
        expect(wrapper).toHaveStyleRule('cursor', 'pointer');
    });
});
