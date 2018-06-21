import React from 'react';
import renderer from 'react-test-renderer';
import Content from '../Content';

describe('<Content />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Content />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
