import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../../../../ui/blocks/Modal/index';
import { Button, H1 } from '../../../../ui/elements/index';
import ModalView from '../ModalView';
import { ModalFilter } from '../styles';

describe('<ModalView />', () => {
    const minProps = {
        modalOpen: false,
        columns: [],
        handleModalSubmit: () => {},
        toggleModal: () => {},
        handleOnChange: () => {},
    };

    const wrapper = shallow(<ModalView {...minProps} />);

    it('should render ModalFilter', () => {
        expect(wrapper.find(ModalFilter).exists()).toBe(true);
    });

    it('should render Modal Blur', () => {
        expect(wrapper.find(Modal.Blur).exists()).toBe(true);
    });

    it('should render Modal Header', () => {
        expect(wrapper.find(Modal.Header).exists()).toBe(true);
    });

    it('should render Modal Content', () => {
        expect(wrapper.find(Modal.Content).exists()).toBe(true);
    });

    it('should render Modal Footer', () => {
        expect(wrapper.find(Modal.Footer).exists()).toBe(true);
    });

    it('should render close icon', () => {
        expect(wrapper.find('i').exists()).toBe(true);
    });

    it('should render two (2) Buttons', () => {
        expect(wrapper.find(Button).exists()).toBe(true);
    });

    it('should render Header Title', () => {
        expect(wrapper.find(H1).exists()).toBe(true);
    });
});
