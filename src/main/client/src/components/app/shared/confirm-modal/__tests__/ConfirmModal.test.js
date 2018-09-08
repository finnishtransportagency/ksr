import React from 'react';
import { shallow } from 'enzyme';
import ConfirmModal from '../ConfirmModal';

const setup = (prop) => {
    const minProps = {
        show: false,
        body: 'Confirmation text',
        acceptText: 'Accept',
        cancelText: 'Cancel',
        accept: jest.fn(),
        hideConfirmModal: jest.fn(),
    };
    const props = prop || minProps;
    const wrapper = shallow(<ConfirmModal {...props} />);

    return { props, wrapper };
};

describe('<ConfirmModal />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should handleCancel properly', () => {
        const spyHandleCancel = jest.spyOn(wrapper.instance(), 'handleCancel');

        wrapper.instance().handleCancel();

        expect(spyHandleCancel).toHaveBeenCalled();
        expect(wrapper.state('fadeOut')).toEqual(true);
    });

    it('should handleAccept properly', () => {
        const { accept } = wrapper.instance().props;
        const spyHandleAccept = jest.spyOn(wrapper.instance(), 'handleAccept');
        const spyHandleCancel = jest.spyOn(wrapper.instance(), 'handleCancel');

        wrapper.instance().handleAccept();

        expect(spyHandleAccept).toHaveBeenCalled();
        expect(accept).toHaveBeenCalled();
        expect(spyHandleCancel).toHaveBeenCalled();
    });
});
