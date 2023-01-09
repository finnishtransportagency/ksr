import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../Icon';

describe.skip('<Icon />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Icon />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Icon />).toJSON();
        expect(wrapper).toHaveStyleRule('padding', '1.5rem 0.5rem');
        expect(wrapper).toHaveStyleRule('text-align', 'center');
        expect(wrapper).toHaveStyleRule('align-self', 'center');
        expect(wrapper).toHaveStyleRule('flex', '1');
    });
});
