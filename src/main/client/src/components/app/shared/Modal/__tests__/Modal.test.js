import React from 'react';
import { shallow } from 'enzyme';
import Modal from '../Modal';

const setup = (prop) => {
    const minProps = {
        title: 'Modal Title',
        submitText: 'Submit',
        cancelText: 'Cancel',
        handleModalSubmit: jest.fn(),
        activeModal: '',
        setActiveModal: () => {},
    };
    const props = prop || minProps;
    const wrapper = shallow(<Modal {...props}><div>Children</div></Modal>);

    return { props, wrapper };
};

describe('<Modal />', () => {
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

    it('should handle submitting properly', () => {
        const { handleModalSubmit } = wrapper.instance().props;
        const spyToggleModal = jest.spyOn(wrapper.instance(), 'toggleModal');

        wrapper.instance().handleSubmit();

        expect(handleModalSubmit).toHaveBeenCalled();
        expect(spyToggleModal).toHaveBeenCalled();
    });
});
