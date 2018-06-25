import React from 'react';
import renderer from 'react-test-renderer';
import Footer from '../Footer';

describe('<Footer />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Footer />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
