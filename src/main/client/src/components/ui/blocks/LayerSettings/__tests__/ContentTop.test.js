import React from 'react';
import renderer from 'react-test-renderer';
import ContentTop from '../ContentTop';

describe('<LayerSettings.ContentTop />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<ContentTop />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
