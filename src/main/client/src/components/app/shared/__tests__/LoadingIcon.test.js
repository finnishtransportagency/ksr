import React from 'react';
import { shallow } from 'enzyme';
import { PulseLoader } from 'react-spinners';
import LoadingIcon from '../LoadingIcon';

const setup = (prop) => {
    const minProps = {
        loading: true,
    };

    const props = prop || minProps;
    const wrapper = shallow(<LoadingIcon {...props} />);

    return { wrapper };
};

describe.skip('<LoadingIcon />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('.loading-icon').exists()).toBe(true);
    });

    it('should render loading icon', () => {
        expect(wrapper.find(PulseLoader).exists()).toBe(true);
    });

    it('should show loading correctly', () => {
        const props1 = {
            loading: true,
        };

        const props2 = {
            loading: false,
        };

        const wrapperLoading = setup(props1).wrapper;
        const wrapperNotLoading = setup(props2).wrapper;

        expect(wrapperLoading.find(PulseLoader).prop('loading')).toEqual(true);
        expect(wrapperNotLoading.find(PulseLoader).prop('loading')).toEqual(false);
    });

    it('should render size correctly', () => {
        const props = {
            loading: true,
            size: 5,
        };

        const wrapperWithSize = setup(props).wrapper;

        expect(wrapper.find(PulseLoader).prop('size')).toEqual(12);
        expect(wrapperWithSize.find(PulseLoader).prop('size')).toEqual(5);
    });
});
