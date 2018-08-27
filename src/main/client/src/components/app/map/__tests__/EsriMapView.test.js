import React from 'react';
import { shallow } from 'enzyme';
import EsriMapView from '../EsriMapView';
import MapToolsContainer from '../map-tools/MapToolsContainer';

const setup = () => {
    const props = {
        activeNav: '',
        isOpenTable: false,
        view: {},
    };
    const wrapper = shallow(<EsriMapView {...props} />);

    return { props, wrapper };
};

describe('<EsriMapView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#mapView').exists()).toBe(true);
        expect(wrapper.find(MapToolsContainer).exists()).toBe(true);
    });
});
