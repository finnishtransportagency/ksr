import React from 'react';
import renderer from 'react-test-renderer';
import Content from '../Content';

describe('<Property.Content />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Content />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Content />).toJSON();
        expect(wrapper).toHaveStyleRule('padding', '0 1rem');
    });
});
