import React from 'react';
import { shallow } from 'enzyme';
import EsriMap from '../EsriMap';
import EsriMapView from '../EsriMapView';

const setup = () => {
    const props = {
        activeNav: '',
    };
    const wrapper = shallow(<EsriMap {...props} />);

    return { props, wrapper };
};

describe('<EsriMap />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(EsriMapView).exists()).toBe(true);
    });

    it('should invoke initMap when component mounts', () => {
        const spy = jest.spyOn(wrapper.instance(), 'initMap');
        wrapper.instance().componentDidMount();
        expect(spy).toHaveBeenCalled();
    });
});
