import renderer from 'react-test-renderer';
import React from 'react';
import { H2 } from '../H2';

describe('<H2 />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<H2 />).toJSON();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toHaveStyleRule('font-size', '18px');
        expect(wrapper).toHaveStyleRule('font-weight', '500');
    });
});
