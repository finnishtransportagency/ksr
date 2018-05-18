import { shallow } from 'enzyme';
import 'jest-styled-components';
import React from 'react';
import Header from '../Header';

describe('<Header />', () => {
    it('works', () => {
        const wrapper = shallow(<Header />);
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct styles', () => {
        const wrapper = shallow(<Header />);
        expect(wrapper).toHaveStyleRule('padding', '1rem');
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('justify-content', 'space-between');
    });
});

