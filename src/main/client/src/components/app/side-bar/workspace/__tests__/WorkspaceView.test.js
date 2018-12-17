import React from 'react';
import { mount } from 'enzyme';
import SideBar from '../../../../ui/blocks/SideBar';
import Workspace from '../../../../ui/blocks/Workspace';
import { Button } from '../../../../ui/elements';
import { WorkspaceWrapper } from '../styles';
import WorkspaceView from '../WorkspaceView';

const setup = (prop) => {
    const minProps = {
        setActiveModal: jest.fn(),
        workspaceList: [{
            name: 'test 1',
            updated: '1.1.2010 13:55',
        }],
        handleDeleteWorkspace: jest.fn(),
        handleReplaceWorkspace: jest.fn(),
        handleSelectWorkspace: jest.fn(),
        handleShareWorkspace: jest.fn(),
    };

    const props = prop || minProps;
    const wrapper = mount(<WorkspaceView {...props} />);

    return { wrapper, minProps };
};

describe('<WorkspaceView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SideBar.Header).length).toBe(1);
        expect(wrapper.find(SideBar.Content).length).toBe(1);
        expect(wrapper.find(WorkspaceWrapper).length).toBe(2);
    });

    it('should call setActiveModal on button click', () => {
        const { setActiveModal } = wrapper.props();

        wrapper.find(Button).at(0).simulate('click');
        expect(setActiveModal).toHaveBeenCalled();
    });

    it('should call handleReplaceWorkspace on delete click', () => {
        const { handleReplaceWorkspace } = wrapper.props();

        wrapper.find(Workspace).at(0).find(Workspace.Icon).at(0)
            .simulate('click');

        expect(handleReplaceWorkspace).toHaveBeenCalled();
    });

    it('should call handleShareWorkspace on share click', () => {
        const { handleShareWorkspace } = wrapper.props();

        wrapper.find(Workspace).at(0).find(Workspace.Icon).at(1)
            .simulate('click');

        expect(handleShareWorkspace).toHaveBeenCalled();
    });

    it('should call handleDeleteWorkspace on delete click', () => {
        const { handleDeleteWorkspace } = wrapper.props();

        wrapper.find(Workspace).at(0).find(Workspace.Icon).at(2)
            .simulate('click');

        expect(handleDeleteWorkspace).toHaveBeenCalled();
    });

    it('should call handleSelectWorkspace on select click', () => {
        const { handleSelectWorkspace } = wrapper.props();

        wrapper.find(Workspace).at(0).find(Workspace.Text).at(1)
            .simulate('click');

        expect(handleSelectWorkspace).toHaveBeenCalled();
    });

    it('should render correct amount of workspaces', () => {
        const { minProps } = setup();

        const props1 = {
            ...minProps,
            workspaceList: [],
        };

        const props2 = {
            ...minProps,
            workspaceList: [{
                name: 'test 1',
                updated: '1.1.2010 13:55',
            }],
        };

        const props3 = {
            ...minProps,
            workspaceList: [{
                name: 'test 1',
                updated: '1.1.2010 07:55',
            }, {
                name: 'test 2',
                updated: '2.2.2010 12:55',
            }, {
                name: 'test 3',
                updated: '3.3.2010 18:55',
            }],
        };

        const wrapper1 = setup(props1).wrapper;
        const wrapper2 = setup(props2).wrapper;
        const wrapper3 = setup(props3).wrapper;

        expect(wrapper1.find(Workspace).length).toBe(0);
        expect(wrapper2.find(Workspace).length).toBe(1);
        expect(wrapper3.find(Workspace).length).toBe(3);
    });
});
