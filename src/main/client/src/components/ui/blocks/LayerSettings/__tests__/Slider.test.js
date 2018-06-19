import React from 'react';
import renderer from 'react-test-renderer';
import Slider from '../Slider';

describe('<LayerSettings.Slider />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Slider />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
