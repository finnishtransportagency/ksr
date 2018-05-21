import { shallow } from 'enzyme';
import 'jest-styled-components';
import React from 'react';
import { H2 } from '../H2';

describe('<H2 />', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<H2 />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toHaveStyleRule('font-size', '18px');
        expect(wrapper).toHaveStyleRule('font-weight', '700');
    });
});
