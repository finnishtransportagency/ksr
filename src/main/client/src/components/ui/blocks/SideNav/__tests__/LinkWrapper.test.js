import { shallow } from 'enzyme';
import React from 'react';
import LinkWrapper from '../LinkWrapper';

describe('<LinkWrapper />', () => {
    it('works', () => {
        const wrapper = shallow(<LinkWrapper />);
        expect(wrapper).toMatchSnapshot();
    });
});
