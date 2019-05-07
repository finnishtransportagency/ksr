import React from 'react';
import renderer from 'react-test-renderer';
import Checkmark from '../Checkmark';

describe('<Radiobutton.Checkmark />', () => {
    it('renders correctly', () => {
        const wrapper = renderer.create(<Checkmark />).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
