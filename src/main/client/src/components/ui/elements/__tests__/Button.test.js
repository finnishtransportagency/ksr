import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from '../Button';

describe('<Button />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Button />).toJSON();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toHaveStyleRule('color', '#F1F1F1');
        expect(wrapper).toHaveStyleRule('background', '#3DB7E4');
    });

    it('sets correct styles with flat prop', () => {
        const wrapper = renderer.create(<Button flat />).toJSON();
        expect(wrapper).toHaveStyleRule('color', '#3DB7E4');
        expect(wrapper).toHaveStyleRule('background', 'none');
    });

    it('sets correct styles with disabled prop', () => {
        const wrapper = renderer.create(<Button disabled />).toJSON();
        expect(wrapper).toHaveStyleRule('opacity', '0.5');
    });
});
