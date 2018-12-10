import React from 'react';
import { mount } from 'enzyme';
import ModalExtractSelectedView from '../ModalExtractSelectedView';
import Radiobutton from '../../../../ui/blocks/Radiobutton';

const setup = (prop) => {
    const minProps = {
        activeFormat: '',
        downloadFormat: '',
        handleRadioChange: jest.fn(),
        outputLink: '',
        extracting: false,
    };
    const props = prop || minProps;
    const wrapper = mount(<ModalExtractSelectedView {...props} />);

    return { props, wrapper };
};

describe('<ModalExtractSelectedView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should render five Radiobuttons', () => {
        expect(wrapper.find(Radiobutton)).toHaveLength(5);
    });

    it('should handle radio change', () => {
        const { handleRadioChange } = wrapper.props();
        const event = { target: { value: 'File Geodatabase - GDB - .gdb' } };

        expect(handleRadioChange).not.toHaveBeenCalled();
        wrapper.find(Radiobutton.Input).at(1).simulate('change', event);
        expect(handleRadioChange).toHaveBeenCalled();
    });
});
