import React from 'react';
import { mount } from 'enzyme';
import ModalBufferSelectedView from '../ModalBufferSelectedView';
import { TextInput } from '../../../../ui/elements';


const setup = (prop) => {
    const minProps = {
        handleBufferChange: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = mount(<ModalBufferSelectedView {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalBufferSelectedView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should contain correct ui element', () => {
        expect(wrapper.find(TextInput)).toHaveLength(1);
    });

    it('should handle input change', () => {
        const { handleBufferChange } = wrapper.props();

        expect(handleBufferChange).not.toHaveBeenCalled();
        wrapper.find(TextInput).simulate('change');
        expect(handleBufferChange).toHaveBeenCalled();
    });
});
