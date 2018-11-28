import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';

describe('<Property.Header />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Header />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Header />).toJSON();
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('flex-direction', 'row');
        expect(wrapper).toHaveStyleRule('justify-content', 'space-between');
        expect(wrapper).toHaveStyleRule('padding', '1rem');
    });
});
