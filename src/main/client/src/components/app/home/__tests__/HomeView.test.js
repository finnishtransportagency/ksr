import React from 'react';
import { shallow } from 'enzyme';
import SideBar from '../../../ui/blocks/SideBar';
import { H2, Button } from '../../../ui/elements';
import EsriMap from '../../map/EsriMap';
import SideNavContainer from '../../shared/SideNav/SideNavContainer';
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
        expect(wrapper.find(SideNavContainer).length).toBe(1);
        expect(wrapper.find(EsriMap).length).toBe(1);
    });
});
