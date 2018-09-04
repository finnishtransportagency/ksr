import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalDeleteSelected from '../ModalDeleteSelected';
import ModalDeleteSelectedView from '../ModalDeleteSelectedView';

const setup = (prop) => {
    const minProps = {
        selectedData: [],
        deleteSelectedData: () => {},
    };

    const props = prop || minProps;
    const wrapper = shallow(<ModalDeleteSelected {...props}>children</ModalDeleteSelected>);

    return { props, wrapper };
};

describe('<ModalDeleteSelected />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <ModalContainer />', () => {
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });

    it('should contain view', () => {
        expect(wrapper.find(ModalDeleteSelectedView).length).toBe(1);
    });

    it('should change deleteComment state', () => {
        expect(wrapper.state('deleteComment')).toBe('');

        const evt = {
            target: {
                value: 'example comment',
            },
        };

        wrapper.instance().handleTextareaChange(evt);
        expect(wrapper.state('deleteComment')).toBe('example comment');
    });
});
