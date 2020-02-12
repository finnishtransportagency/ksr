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
        expect(wrapper).toHaveStyleRule('padding', '0 1rem');
        expect(wrapper).toHaveStyleRule('overflow', 'hidden');
        expect(wrapper).toHaveStyleRule('text-overflow', 'ellipsis', {
            modifier: ':first-of-type',
        });
        expect(wrapper).toHaveStyleRule('width', '120px', {
            modifier: ':first-of-type',
        });
        expect(wrapper).toHaveStyleRule('min-width', '120px', {
            modifier: ':first-of-type',
        });
        expect(wrapper).toHaveStyleRule('text-overflow', 'ellipsis', {
            modifier: ':last-of-type',
        });
    });
});
