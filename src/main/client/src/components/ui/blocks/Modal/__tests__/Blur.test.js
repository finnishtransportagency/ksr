import React from 'react';
import renderer from 'react-test-renderer';
import Blur from '../Blur';

describe('<Blur />', () => {
    it('works', () => {
        const wrapper = renderer.create(<Blur />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
