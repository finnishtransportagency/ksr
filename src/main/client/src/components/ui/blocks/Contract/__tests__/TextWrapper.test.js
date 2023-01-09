import React from 'react';
import renderer from 'react-test-renderer';
import TextWrapper from '../TextWrapper';

describe.skip('<TextWrapper />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<TextWrapper />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<TextWrapper />).toJSON();
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('flex', '1 1 auto');
        expect(wrapper).toHaveStyleRule('overflow', 'hidden');
        expect(wrapper).toHaveStyleRule('white-space', 'nowrap');
    });
});
