import React from 'react';
import renderer from 'react-test-renderer';
import Radiobutton from '../index';

describe.skip('<Radiobutton />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Radiobutton />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
