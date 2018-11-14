import React from 'react';
import renderer from 'react-test-renderer';
import Contract from '../index';

describe('<Contract />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Contract />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Contract />).toJSON();
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('justify-content', 'space-between');
        expect(wrapper).toHaveStyleRule('margin', '1rem 0');
    });
});
