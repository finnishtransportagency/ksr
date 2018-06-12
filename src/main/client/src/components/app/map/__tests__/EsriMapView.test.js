import React from 'react';
import { shallow } from 'enzyme';
import EsriMapView from '../EsriMapView';
import MapMeasure from '../map-measure/MapMeasure';

const setup = () => {
    const props = {
        activeNav: '',
    };
    const wrapper = shallow(<EsriMapView {...props} />);

    return { props, wrapper };
};

describe('<EsriMapView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#mapView').exists()).toBe(true);
        expect(wrapper.find(MapMeasure).exists()).toBe(true);
    });
});
