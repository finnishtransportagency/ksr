import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import SideBar from '../../../ui/blocks/SideBar';
import EsriMap from '../../map/EsriMap';
import SideNavView from '../../shared/SideNav/SideNavView';
import HomeView from '../HomeView';

describe('<HomeView />', () => {
    const wrapper = shallow(<HomeView />);

    it('renders <HomeView />', () => {
        expect(wrapper.exists()).to.be.true;
    });

    it('renders EsriMap', () => {
        expect(wrapper.find(EsriMap)).to.have.length(1);
    });

    it('renders <SideNavView />', () => {
        expect(wrapper.find(SideNavView)).to.have.length(1);
    });

    it('renders <SideBar />', () => {
        expect(wrapper.find(SideBar)).to.have.length(1);
    });
});
