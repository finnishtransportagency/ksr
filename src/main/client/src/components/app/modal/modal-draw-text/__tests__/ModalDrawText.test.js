import React from 'react';
import { shallow } from 'enzyme';
import ModalDrawText from '../ModalDrawText';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalDrawTextView from '../ModalDrawTextView';

const setup = () => {
    const props = {
        setDrawText: jest.fn(),
    };

    const wrapper = shallow(<ModalDrawText {...props} />);
    return { props, wrapper };
};

describe.skip('<ModalDrawText />', () => {
    const { props, wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ModalDrawTextView).exists()).toBe(true);
    });

    it('should handle text change with text with trailing space', () => {
        const evt = {
            target: { value: 'New text ' },
        };

        const instance = wrapper.instance();
        instance.handleTextChange(evt);
        expect(wrapper.state('text')).toBe('New text');
    });

    it('should not change text if no text is given', () => {
        const evt = {};

        const instance = wrapper.instance();
        instance.setState({ text: '' });
        instance.handleTextChange(evt);
        expect(wrapper.state('text')).toBe('');
    });

    it('should have fired setDrawText prop', () => {
        const instance = wrapper.instance();
        instance.handleModalSubmit();
        expect(props.setDrawText).toBeCalled();
    });
});
