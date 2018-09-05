import React from 'react';
import renderer from 'react-test-renderer';
import TextColumn from '../TextColumn';

describe('<TextColumn />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<TextColumn />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<TextColumn />).toJSON();
        expect(wrapper).toHaveStyleRule('flex-direction', 'column');
        expect(wrapper).toHaveStyleRule('flex', '7');
        expect(wrapper).toHaveStyleRule('overflow', 'hidden');
    });
});
