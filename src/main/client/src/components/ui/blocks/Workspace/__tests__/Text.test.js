import React from 'react';
import renderer from 'react-test-renderer';
import Text from '../Text';

describe('<Text />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Text />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Text />).toJSON();
        expect(wrapper).toHaveStyleRule('justify-self', 'center');
        expect(wrapper).toHaveStyleRule('align-self', 'center');
        expect(wrapper).toHaveStyleRule('overflow', 'hidden');
        expect(wrapper).toHaveStyleRule('text-overflow', 'ellipsis');
        expect(wrapper).toHaveStyleRule('padding', '0.5rem');
    });
});
