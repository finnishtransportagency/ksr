import React from 'react';
import { shallow } from 'enzyme';
import MapLayersView from '../MapLayersView';
import { ButtonLayerNav } from '../styles';
import SideBar from '../../../../ui/blocks/SideBar';

function setup() {
    const props = {
        handleButtonClickLayers: () => {},
        activeTab: '',
    };
    const wrapper = shallow(<MapLayersView />);

    return { props, wrapper };
}

describe('<MapLayersView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(ButtonLayerNav).length).toBe(2);
        expect(wrapper.find(SideBar.Header).length).toBe(1);
        expect(wrapper.find(SideBar.Content).length).toBe(1);
    });
});
