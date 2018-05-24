import React from 'react';
import { shallow } from 'enzyme';
import EsriMapView from '../EsriMapView';

function setup() {
    const props = {
        activeNav: '',
    };
    const wrapper = shallow(<EsriMapView {...props} />);

    return { props, wrapper };
}

describe('<EsriMapView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find('#mapView').length).toBe(1);
    });
});
