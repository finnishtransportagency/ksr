import React from 'react';
import { shallow } from 'enzyme';
import EsriMap from '../EsriMap';
import EsriMapView from '../EsriMapView';

const setup = () => {
    const props = {
        activeNav: '',
        layerList: [],
        fetching: true,
        isOpenTable: true,
        mapCenter: [425574, 7051264],
        mapScale: 9244648,
        selectFeatures: () => {},
        layers: [],
        view: {},
    };
    const wrapper = shallow(<EsriMap {...props} />);

    return { props, wrapper };
};

describe('<EsriMap />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(EsriMapView).exists()).toBe(true);
    });
});
