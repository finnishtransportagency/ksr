import React from 'react';
import renderer from 'react-test-renderer';
import LinkWrapper from '../LinkWrapper';

describe.skip('<LinkWrapper />', () => {
    it('works', () => {
        const wrapper = renderer.create(<LinkWrapper />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
