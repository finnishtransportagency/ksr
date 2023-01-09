import React from 'react';
import { mount } from 'enzyme';
import { TextInput } from '../../../../ui/elements';
import ModalNewWorkspaceView from '../ModalNewWorkspaceView';

const setup = (prop) => {
    const minProps = {
        handleInputChange: jest.fn(),
        workspaceName: '',
        submitDisabled: true,
        fetching: false,
    };

    const props = prop || minProps;
    const wrapper = mount(<ModalNewWorkspaceView {...props} />);

    return { wrapper, minProps };
};

describe.skip('<ModalNewWorkspaceView />', () => {
    it('should render check icon', () => {
        const props = {
            handleInputChange: jest.fn(),
            workspaceName: 'test',
            submitDisabled: false,
            fetching: false,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(TextInput).length).toBe(1);
        expect(wrapper.find('.fa-check').length).toBe(1);
    });

    it('should render loading icon', () => {
        const props = {
            handleInputChange: jest.fn(),
            workspaceName: 'test',
            submitDisabled: true,
            fetching: true,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(TextInput).length).toBe(1);
        expect(wrapper.find('.loading-icon').length).toBe(1);
    });

    it('should render error icon', () => {
        const props = {
            handleInputChange: jest.fn(),
            workspaceName: 'test',
            submitDisabled: true,
            fetching: false,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(TextInput).length).toBe(1);
        expect(wrapper.find('.fa-exclamation-triangle').length).toBe(1);
    });
});
