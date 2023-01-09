import React from 'react';
import renderer from 'react-test-renderer';
import Layer from '../Layer';

describe.skip('<LayerGroup.Layer />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Layer />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Layer />).toJSON();
        expect(wrapper).toHaveStyleRule('display', 'flex');
    });
});
