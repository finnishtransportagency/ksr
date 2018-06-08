import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import React from 'react';
import { H1 } from '../H1';

describe('<H1 />', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<H1 />).toJSON();
        expect(tree).toMatchSnapshot();
        // expect(wrapper).toHaveStyleRule('font-size', '22px');
        // expect(wrapper).toHaveStyleRule('font-weight', '700');
    });
});
