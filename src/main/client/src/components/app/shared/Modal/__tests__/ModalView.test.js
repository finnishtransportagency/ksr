import React from 'react';
import { mount } from 'enzyme';
import Modal from '../../../../ui/blocks/Modal';
import { H1, Button } from '../../../../ui/elements';
import ModalView from '../ModalView';

const setup = (prop) => {
    const minProps = {
        toggleModal: jest.fn(),
        handleModalSubmit: jest.fn(),
        content: 'Example content text.',
        title: 'Modal Title',
        submitText: 'Submit',
        cancelText: 'Cancel',
    };
    const props = prop || minProps;
    const wrapper = mount(<ModalView {...props} />);

    return { props, wrapper };
};

describe('<ModalView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should contain Modal ui block', () => {
        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Modal.Blur)).toHaveLength(1);
        expect(wrapper.find(Modal.Header)).toHaveLength(1);
        expect(wrapper.find(Modal.Content)).toHaveLength(1);
        expect(wrapper.find(Modal.Footer)).toHaveLength(1);
    });

    it('should have correct title', () => {
        expect(wrapper.find(Modal.Header).find(H1)).toHaveLength(1);
        expect(wrapper.find(Modal.Header).find(H1).text()).toBe('Modal Title');
    });

    it('should have correct text on buttons', () => {
        expect(wrapper.find(Modal.Footer).find(Button)).toHaveLength(2);
        expect(wrapper.find(Modal.Footer).find(Button).at(0).text()).toBe('Submit');
        expect(wrapper.find(Modal.Footer).find(Button).at(1).text()).toBe('Cancel');
    });

    it('should have correct content', () => {
        expect(wrapper.find(Modal.Content).text()).toBe('Example content text.');
    });

    it('should invoke submit', () => {
        const { handleModalSubmit } = wrapper.props();
        wrapper.find(Modal.Footer).find(Button).at(0).simulate('click');

        expect(handleModalSubmit).toHaveBeenCalled();
    });

    it('should invoke toggle', () => {
        const { toggleModal } = wrapper.props();
        wrapper.find(Modal.Footer).find(Button).at(1).simulate('click');
        wrapper.find(Modal.Header).find('button').simulate('click');

        expect(toggleModal).toHaveBeenCalledTimes(2);
    });
});
