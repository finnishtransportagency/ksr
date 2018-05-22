import React from 'react';
import { shallow } from 'enzyme';
import EsriMap from '../EsriMap';
import EsriMapView from '../EsriMapView';

function setup() {
    const props = {
        activeNav: '',
    };
    const wrapper = shallow(<EsriMap {...props} />);

    return { props, wrapper };
}

describe('components', () => {
    describe('<EsriMap />', () => {
        const { wrapper } = setup();

        it('should render self', () => {
            expect(wrapper.find(EsriMapView).length).toBe(1);
        });
    });
});
