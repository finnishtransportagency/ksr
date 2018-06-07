import React from 'react';
import { shallow } from 'enzyme';
import { PulseLoader } from 'react-spinners';
import LoadingIcon from '../LoadingIcon';

const setup = () => {
    const props = {
        loading: true,
    };
    const wrapper = shallow(<LoadingIcon {...props} />);

    return { props, wrapper };
};

describe('<LoadingIcon />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('.loading-icon').exists()).toBe(true);
    });

    it('should render loading icon', () => {
        expect(wrapper.find(PulseLoader).exists()).toBe(true);
    });
});
