import { shallow } from 'enzyme';
import 'jest-styled-components';
import React from 'react';
import Content from '../Content';

describe('<Content />', () => {
    it('works', () => {
        const wrapper = shallow(<Content />);
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct styles', () => {
        const wrapper = shallow(<Content />);
        expect(wrapper).toHaveStyleRule('padding', '1rem');
    });
});

