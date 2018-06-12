import React from 'react';
import renderer from 'react-test-renderer';
import Content from '../Content';

it('renders correctly', () => {
    const wrapper = renderer.create(<Content />).toJSON();
    expect(wrapper).toMatchSnapshot();
});

describe('<LayerSettings.Content />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Content />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Content />).toJSON();
        expect(wrapper).toHaveStyleRule('background', '#F1F1F1');
        expect(wrapper).toHaveStyleRule('color', '#444444');
        expect(wrapper).toHaveStyleRule('box-shadow', '0 2px 4px 0 hsla(0,0%,0%,0.4)');
    });
});
