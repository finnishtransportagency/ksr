import React from 'react';
import renderer from 'react-test-renderer';
import IconWrapper from '../IconWrapper';

describe.skip('<IconWrapper />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<IconWrapper />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<IconWrapper />).toJSON();
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('flex', '0 0 auto');
        expect(wrapper).toHaveStyleRule('text-align', 'center');
        expect(wrapper).toHaveStyleRule('justify-content', 'center');
        expect(wrapper).toHaveStyleRule('align-items', 'center');
    });
});
