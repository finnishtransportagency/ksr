import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';

describe('<Header />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Header />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('has correct styles', () => {
        const wrapper = renderer.create(<Header />).toJSON();
        expect(wrapper).toHaveStyleRule('padding', '1rem 1rem 0');
        expect(wrapper).toHaveStyleRule('display', 'flex');
        expect(wrapper).toHaveStyleRule('justify-content', 'space-between');
    });
});

