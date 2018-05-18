import React from 'react';
import { shallow } from 'enzyme';
import SideNav from '../../../../ui/blocks/SideNav';
import SideNavView from '../SideNavView';

function setup() {
    const props = {};
    const wrapper = shallow(<SideNavView />);

    return { props, wrapper };
}

describe('components', () => {
    describe('<SideNavView />', () => {
        const { wrapper } = setup();

        it('should render self', () => {
            expect(wrapper.find(SideNav).length).toBe(1);
            expect(wrapper.find(SideNav.Logo).length).toBe(1);
            expect(wrapper.find(SideNav.LinkWrapper).length).toBe(1);
            expect(wrapper.find(SideNav.Link).length).toBe(3);
        });
    });
});
