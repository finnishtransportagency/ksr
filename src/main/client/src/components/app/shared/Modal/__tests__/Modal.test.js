import React from 'react';
import { shallow } from 'enzyme';
import Modal from '../Modal';

const setup = (prop) => {
    const minProps = {
        title: 'Modal Title',
        cancelText: 'Cancel',
        activeModal: '',
        setActiveModal: () => {},
        modalSubmit: [{
            text: 'Submit',
            handleSubmit: jest.fn(),
            disabled: false,
            toggleModal: false,
        }, {
            text: 'Submit',
            handleSubmit: jest.fn(),
            disabled: false,
            toggleModal: true,
        }],
    };
    const props = prop || minProps;
    const wrapper = shallow(<Modal {...props}><div>Children</div></Modal>);

    return { props, wrapper };
};

describe.skip('<Modal />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should toggleModal properly', () => {
        const { activeModal } = wrapper.instance().props;

        wrapper.instance().toggleModal();
        expect(activeModal).toBe('');
        expect(wrapper.state('fadeOut')).toEqual(true);
    });

    it('should handle submitting properly with toggle', () => {
        const { modalSubmit } = wrapper.instance().props;
        const spyToggleModal = jest.spyOn(wrapper.instance(), 'toggleModal');
        const spyHandleSubmit = jest.spyOn(modalSubmit[0], 'handleSubmit');

        wrapper.instance().handleSubmit(0);

        expect(spyHandleSubmit).toHaveBeenCalled();
        expect(spyToggleModal).not.toHaveBeenCalled();
    });

    it('should handle submitting properly without toggle', () => {
        const { modalSubmit } = wrapper.instance().props;
        const spyToggleModal = jest.spyOn(wrapper.instance(), 'toggleModal');
        const spyHandleSubmit = jest.spyOn(modalSubmit[1], 'handleSubmit');

        wrapper.instance().handleSubmit(1);

        expect(spyHandleSubmit).toHaveBeenCalled();
        expect(spyToggleModal).toHaveBeenCalled();
    });
});
