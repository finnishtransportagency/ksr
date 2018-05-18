import { shallow } from 'enzyme';
import React from 'react';
import { H1 } from '../H1';

test('it works', () => {
    const wrapper = shallow(<H1 />);
    expect(wrapper).toMatchSnapshot();
});
