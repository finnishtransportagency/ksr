import React from 'react';
import renderer from 'react-test-renderer';
import RemoveIcon from '../RemoveIcon';

describe('<LayerGroup.Layer.RemoveIcon />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<RemoveIcon />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct style rules', () => {
        const wrapper = renderer.create(<RemoveIcon />).toJSON();
        expect(wrapper).toHaveStyleRule('flex', '1');
        expect(wrapper).toHaveStyleRule('align-self', 'center');
        expect(wrapper).toHaveStyleRule('text-align', 'right');
    });
});
