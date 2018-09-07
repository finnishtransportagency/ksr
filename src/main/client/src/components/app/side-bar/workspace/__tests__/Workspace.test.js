import React from 'react';
import { shallow } from 'enzyme';
import Workspace from '../Workspace';
import WorkspaceView from '../WorkspaceView';

const setup = () => {
    const props = {
        setActiveModal: jest.fn(),
        workspaceList: [{}],
        getWorkspaceList: jest.fn(),
        layerList: [{}],
        view: {
            scale: 20000,
            center: {
                x: 1700,
                y: 200,
            },
        },
        selectedFeatures: [{}],
        showConfirmModal: jest.fn(),
    };
    const wrapper = shallow(<Workspace {...props} />);

    return { wrapper };
};

describe('<Workspace />', () => {
    const { wrapper } = setup();

    it('should render view ', () => {
        expect(wrapper.find(WorkspaceView).exists()).toBe(true);
    });

    it('should handleDeleteWorkspace correctly', () => {
        const { showConfirmModal } = wrapper.instance().props;
        wrapper.instance().handleDeleteWorkspace();

        expect(showConfirmModal).toHaveBeenCalled();
    });

    it('should handleReplaceWorkspace correctly', () => {
        const { showConfirmModal } = wrapper.instance().props;
        wrapper.instance().handleReplaceWorkspace();

        expect(showConfirmModal).toHaveBeenCalled();
    });
});
