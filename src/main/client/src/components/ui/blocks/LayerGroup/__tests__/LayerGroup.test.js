import React from 'react';
import renderer from 'react-test-renderer';
import LayerGroup from '../index';

describe.skip('<LayerGroup />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<LayerGroup />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<LayerGroup />).toJSON();
        expect(wrapper).toHaveStyleRule('background', '#F1F1F1');
        expect(wrapper).toHaveStyleRule('color', '#444444');
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('flex-direction', 'column');
        expect(wrapper).toHaveStyleRule('transition', '0.3s');
        expect(wrapper).toHaveStyleRule('box-shadow', '0 2px 4px 0 hsla(0,0%,0%,0.4)');
        expect(wrapper).toHaveStyleRule('user-select', 'none');
        expect(wrapper).toHaveStyleRule('margin', '1rem');
    });
});
