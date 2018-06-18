import React from 'react';
import renderer from 'react-test-renderer';
import Table from '../index';

describe('<Table />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Table />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
