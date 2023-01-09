import React from 'react';
import renderer from 'react-test-renderer';
import Label from '../Label';

describe.skip('<LayerGroup.Layer.Label />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Label />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<Label />).toJSON();
        expect(wrapper).toHaveStyleRule('flex', '9');
    });
});
