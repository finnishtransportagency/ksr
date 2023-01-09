import React from 'react';
import renderer from 'react-test-renderer';
import Table from '../index';

describe.skip('<Table />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Table />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
