import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../Link';

describe.skip('<Link />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Link />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
