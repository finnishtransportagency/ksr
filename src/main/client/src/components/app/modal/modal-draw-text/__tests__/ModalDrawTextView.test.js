import React from 'react';
import { shallow } from 'enzyme';
import ModalDrawTextView from '../ModalDrawTextView';
import { TextInput } from '../../../../ui/elements';

const setup = () => {
    const props = {
        handleTextChange: jest.fn(),
    };
    const wrapper = shallow(<ModalDrawTextView {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalDrawTextView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('label[htmlFor="modalDrawTextInput"]').exists()).toBe(true);
        expect(wrapper.find(TextInput).exists()).toBe(true);
    });
});

