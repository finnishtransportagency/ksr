import React from 'react';
import { shallow } from 'enzyme';
import MapLayersView from '../MapLayersView';
import { ButtonLayerNav } from '../styles';
import SideBar from '../../../../ui/blocks/SideBar';

const setup = () => {
    const props = {
        handleButtonClickLayers: () => {},
        activeTab: '',
    };
    const wrapper = shallow(<MapLayersView />);

    return { props, wrapper };
};

describe.skip('<MapLayersView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(ButtonLayerNav).length).toBe(5);
        expect(wrapper.find(SideBar.Header).length).toBe(1);
        expect(wrapper.find(SideBar.Content).length).toBe(1);
    });
});
