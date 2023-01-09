import React from 'react';
import { shallow } from 'enzyme';
import InitMapContainer from '../../map/InitMapContainer';
import ModalContainer from '../../modal/ModalContainer';
import SideBarContainer from '../../side-bar/SideBarContainer';
import SideNavContainer from '../../side-nav/SideNavContainer';
import HomeView from '../HomeView';
import TableContainer from '../../table/TableContainer';

const setup = () => {
    const props = {
        loadingWorkspace: false,
    };
    const wrapper = shallow(<HomeView {...props} />);

    return { props, wrapper };
};

describe.skip('<HomeView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(SideNavContainer).length).toBe(1);
        expect(wrapper.find(InitMapContainer).length).toBe(1);
        expect(wrapper.find(SideBarContainer).length).toBe(1);
        expect(wrapper.find(TableContainer).length).toBe(1);
        expect(wrapper.find(ModalContainer).length).toBe(1);
    });
});
