import React from 'react';
import renderer from 'react-test-renderer';
import ButtonWrapper from '../ButtonWrapper';

describe('<ButtonWrapper />', () => {
    it('works', () => {
        const wrapper = renderer.create(<ButtonWrapper />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
