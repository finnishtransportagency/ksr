import React from 'react';
import renderer from 'react-test-renderer';
import Span from '../Span';

describe('<LayerGroup.Span />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Span />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Span />).toJSON();
        expect(wrapper).toHaveStyleRule('flex', '9');
        expect(wrapper).toHaveStyleRule('align-self', 'center');
        expect(wrapper).toHaveStyleRule('text-align', 'left');
    });
});
