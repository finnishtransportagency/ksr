import React from 'react';
import renderer from 'react-test-renderer';
import ContentMain from '../ContentMain';

describe.skip('<LayerSettings.ContentMain />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<ContentMain />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
