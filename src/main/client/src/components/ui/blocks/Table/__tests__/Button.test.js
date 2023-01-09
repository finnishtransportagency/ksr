import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

describe.skip('<Button />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Button />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
