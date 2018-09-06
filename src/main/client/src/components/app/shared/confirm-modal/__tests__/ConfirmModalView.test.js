import React from 'react';
import { mount } from 'enzyme';
import Modal from '../../../../ui/blocks/Modal';
import { Button } from '../../../../ui/elements';
import ConfirmModalView from '../ConfirmModalView';

const setup = (prop) => {
    const minProps = {
        handleAccept: jest.fn(),
        handleCancel: jest.fn(),
        body: 'Confirmation text',
        acceptText: 'Accept',
        cancelText: 'Cancel',
    };
    const props = prop || minProps;
    const wrapper = mount(<ConfirmModalView {...props} />);

    return { props, wrapper };
};

describe('<ConfirmModalView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should contain Modal ui block', () => {
        expect(wrapper.find(Modal)).toHaveLength(1);
        expect(wrapper.find(Modal.Blur)).toHaveLength(1);
        expect(wrapper.find(Modal.Content)).toHaveLength(1);
        expect(wrapper.find(Modal.Footer)).toHaveLength(1);
    });

    it('should have correct content text', () => {
        expect(wrapper.find(Modal.Content).find('p')).toHaveLength(1);
        expect(wrapper.find(Modal.Content).find('p').text()).toBe('Confirmation text');
    });

    it('should have correct text on buttons', () => {
        expect(wrapper.find(Modal.Footer).find(Button)).toHaveLength(2);
        expect(wrapper.find(Modal.Footer).find(Button).at(0).text()).toBe('Accept');
        expect(wrapper.find(Modal.Footer).find(Button).at(1).text()).toBe('Cancel');
    });

    it('should invoke accept', () => {
        const { handleAccept } = wrapper.props();
        wrapper.find(Modal.Footer).find(Button).at(0).simulate('click');

        expect(handleAccept).toHaveBeenCalled();
    });

    it('should invoke cancel', () => {
        const { handleCancel } = wrapper.props();
        wrapper.find(Modal.Footer).find(Button).at(1).simulate('click');

        expect(handleCancel).toHaveBeenCalled();
    });
});
