import React from 'react';
import renderer from 'react-test-renderer';
import Input from '../Input';

describe('<Radiobutton.Input />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Input />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
