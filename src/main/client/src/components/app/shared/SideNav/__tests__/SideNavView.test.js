import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import SideNav from '../../../../ui/blocks/SideNav';
import SideNavView from '../SideNavView';

describe('<SideNavView />', () => {
    const wrapper = shallow(<SideNavView />);

    it('renders <SideNavView />', () => {
        expect(wrapper.exists()).to.be.true;
    });

    it('renders <SideNav />', () => {
        expect(wrapper.find(SideNav)).to.have.length(1);
    });

    it('renders <SideNav.Logo />', () => {
        expect(wrapper.find(SideNav.Logo)).to.have.length(1);
    });

    it('renders <SideNav.LinkWrapper />', () => {
        expect(wrapper.find(SideNav.LinkWrapper)).to.have.length(1);
    });

    it('renders three (3) <SideNav.Link />', () => {
        expect(wrapper.find(SideNav.Link)).to.have.length(3);
    });
});
