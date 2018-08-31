import React from 'react';
import { shallow } from 'enzyme';
import Workspace from '../Workspace';
import WorkspaceView from '../WorkspaceView';

const setup = () => {
    const props = {
        setActiveModal: jest.fn(),
    };
    const wrapper = shallow(<Workspace {...props} />);

    return { wrapper };
};

describe('<Workspace />', () => {
    const { wrapper } = setup();

    it('should render view ', () => {
        expect(wrapper.find(WorkspaceView).exists()).toBe(true);
    });
});
