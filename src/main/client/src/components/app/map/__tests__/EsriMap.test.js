import React from 'react';
import { shallow } from 'enzyme';
import { getLayerGroups } from '../../../../api/map-layers/layerGroups';
import EsriMap from '../EsriMap';
import EsriMapView from '../EsriMapView';

const setup = () => {
    const props = {
        wmsLayers: [],
        wmtsLayers: [],
        activeNav: '',
        layerGroups: jest.fn(),
        getLayerGroups: jest.fn(),
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
