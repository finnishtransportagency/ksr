import { shallow } from 'enzyme';
import React from 'react';
import Modal from '../Modal';

describe('<Modal />', () => {
    const minProps = {
        columns: [],
        modalOpen: false,
        handleModalSubmit: () => {},
        toggleModal: () => {},
        handleOnChange: () => {},
    };

    const wrapper = shallow(<Modal {...minProps} />);

    it('should toggle modal when toggleModal invoked', () => {
        wrapper.setState({ modalOpen: false });
        wrapper.instance().toggleModal();

        expect(wrapper.state('modalOpen')).toBe(true);
    });

    it('should toggle modal when handleSubmit invoked', () => {
        wrapper.setState({ modalOpen: false });
        wrapper.instance().handleSubmit();

        expect(wrapper.state('modalOpen')).toBe(true);
    });
});
