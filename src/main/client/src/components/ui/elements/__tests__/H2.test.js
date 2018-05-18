import { shallow } from 'enzyme';
import React from 'react';
import { H2 } from '../H2';

test('it works', () => {
    const wrapper = shallow(<H2 />);
    expect(wrapper).toMatchSnapshot();
});
