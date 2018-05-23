import { shallow } from 'enzyme';
import React from 'react';
import Link from '../Link';

describe('<Link />', () => {
    it('works', () => {
        const wrapper = shallow(<Link />);
        expect(wrapper).toMatchSnapshot();
    });
});
