import React from 'react';
import { mount } from 'enzyme';
import SideBar from '../../../../ui/blocks/SideBar';
import { Button } from '../../../../ui/elements';
import { WorkspaceWrapper } from '../styles';
import WorkspaceView from '../WorkspaceView';

const setup = (prop) => {
    const minProps = {
        setActiveModal: jest.fn(),
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
        expect(wrapper.find(WorkspaceWrapper).length).toBe(1);
    });

    it('should call setActiveModal on button click', () => {
        const { setActiveModal } = wrapper.props();

        wrapper.find(Button).at(0).simulate('click');
        expect(setActiveModal).toHaveBeenCalled();
    });
});
