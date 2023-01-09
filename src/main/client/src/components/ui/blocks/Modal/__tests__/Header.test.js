import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';

describe.skip('<Header />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Header />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
