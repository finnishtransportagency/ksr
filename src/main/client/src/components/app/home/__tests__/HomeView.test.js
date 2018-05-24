import React from 'react';
import { shallow } from 'enzyme';
import EsriMapContainer from '../../map/EsriMapContainer';
import SideBarContainer from '../../side-bar/SideBarContainer';
import SideNavContainer from '../../side-nav/SideNavContainer';
import HomeView from '../HomeView';

function setup() {
    const props = {};
    const wrapper = shallow(<HomeView />);

    return { props, wrapper };
}

describe('<HomeView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SideNavContainer).length).toBe(1);
        expect(wrapper.find(EsriMapContainer).length).toBe(1);
        expect(wrapper.find(SideBarContainer).length).toBe(1);
    });
});
