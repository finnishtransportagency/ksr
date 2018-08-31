import React from 'react';
import { shallow } from 'enzyme';
import ModalContainer from '../../../shared/Modal/ModalContainer';
import ModalNewWorkspace from '../ModalNewWorkspace';
import ModalNewWorkspaceView from '../ModalNewWorkspaceView';

const setup = () => {
    const props = {
        view: {
            scale: 20000,
            center: {
                x: 1,
                y: 1,
            },
        },
        layerList: [],
        selectedFeatures: [],
    };
    const wrapper = shallow(<ModalNewWorkspace {...props} />);

    return { wrapper };
};

describe('<ModalNewWorkspace />', () => {
    const { wrapper } = setup();

    it('should render modal view ', () => {
        expect(wrapper.find(ModalContainer).exists()).toBe(true);
        expect(wrapper.find(ModalNewWorkspaceView).exists()).toBe(true);
    });

    it('should handle handleInputChange correctly', () => {
        wrapper.setState({ workspaceName: '' });
        expect(wrapper.state('workspaceName')).toEqual('');

        const evt = {
            target: {
                name: 'workspaceName',
                value: 'test',
            },
        };

        wrapper.instance().handleInputChange(evt);
        expect(wrapper.state('workspaceName')).toEqual('test');
    });
});
