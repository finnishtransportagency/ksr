import React from 'react';
import { shallow } from 'enzyme';
import SideBar from '../../../ui/blocks/SideBar';
import SideBarView from '../SideBarView';

const setup = () => {
    const props = {};
    const wrapper = shallow(<SideBarView />);

    return { props, wrapper };
};

describe('<SideBarView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SideBar).length).toBe(1);
    });
});
