import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../Icon';

describe('<Icon />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Icon />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Icon />).toJSON();
        expect(wrapper).toHaveStyleRule('color', '#0088CE', {
            modifier: ':hover',
        });
    });
});
