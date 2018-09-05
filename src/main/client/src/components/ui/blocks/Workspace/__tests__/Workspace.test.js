import React from 'react';
import renderer from 'react-test-renderer';
import Workspace from '../index';

describe('<Workspace />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Workspace />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Workspace />).toJSON();
        expect(wrapper).toHaveStyleRule('background', '#F1F1F1');
        expect(wrapper).toHaveStyleRule('color', '#444444');
        expect(wrapper).toHaveStyleRule('margin', '1em 0');
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('flex-direction', 'row');
        expect(wrapper).toHaveStyleRule('width', '100%');
        expect(wrapper).toHaveStyleRule('user-select', 'none');
        expect(wrapper).toHaveStyleRule('white-space', 'nowrap');
    });
});
