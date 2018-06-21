import React from 'react';
import renderer from 'react-test-renderer';
import Checkmark from '../Checkmark';

describe('<Checkbox.Checkmark />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Checkmark />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Checkmark />).toJSON();
        expect(wrapper).toHaveStyleRule('background-color', '#c8c8c8');
        expect(wrapper).toHaveStyleRule('box-shadow', 'inset 0 2px 4px 0 hsla(0,0%,0%,0.1)');
    });
});
