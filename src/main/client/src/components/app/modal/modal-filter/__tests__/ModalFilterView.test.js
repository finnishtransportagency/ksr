import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../../../ui/blocks/Checkbox';
import ModalFilterView from '../ModalFilterView';
import { ModalFilterWrapper } from '../styles';

const setup = (prop) => {
    const minProps = {
        columns: [
            {
                Header: 'ObjectID',
                show: false,
            },
            {
                Header: 'Name',
                show: false,
            },
        ],
        handleOnChange: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = mount(<ModalFilterView {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalFilterView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should contain correct ui elements', () => {
        expect(wrapper.find(ModalFilterWrapper)).toHaveLength(1);
        expect(wrapper.find(Checkbox)).toHaveLength(2);
    });

    it('should handle input change', () => {
        const { handleOnChange } = wrapper.props();
        wrapper.find(Checkbox.Input).at(0).simulate('change');
        wrapper.find(Checkbox.Input).at(1).simulate('change');

        expect(handleOnChange).toHaveBeenCalledTimes(2);
    });
});
