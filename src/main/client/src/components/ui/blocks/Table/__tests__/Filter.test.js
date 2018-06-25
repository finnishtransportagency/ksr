import React from 'react';
import renderer from 'react-test-renderer';
import Filter from '../Filter';

describe('<Filter />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Filter />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
