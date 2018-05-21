import React from 'react';
import { shallow } from 'enzyme';
import SideBar from '../../../ui/blocks/SideBar';
import { H2, Button } from '../../../ui/elements';
import SideNavView from '../../shared/SideNav/SideNavView';
import HomeView from '../HomeView';

function setup() {
    const props = {};
    const wrapper = shallow(<HomeView />);

    return { props, wrapper };
}

describe('<HomeView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SideBar).length).toBe(1);
    });

    it('should have correct SideBar content', () => {
        expect(wrapper.find(SideBar.Header).length).toBe(1);
        expect(wrapper.find(SideBar.Content).length).toBe(1);

        const sideBarHeader = wrapper.find(SideBar.Header);
        expect(sideBarHeader.find(H2).dive().text()).toBe('Karttatasot');

        const sideBarContent = wrapper.find(SideBar.Content);
        expect(sideBarContent.find(Button).length).toBe(3);
    });
});
