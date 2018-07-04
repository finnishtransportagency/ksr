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
    };
    const wrapper = shallow(<EsriMap {...props} />);

    return { props, wrapper };
};

describe('<EsriMap />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(EsriMapView).exists()).toBe(true);
    });

    it('should invoke initMap when fetching completed', () => {
        const spy = jest.spyOn(wrapper.instance(), 'initMap');
        const prevProps = {
            activeNav: '',
            layerList: [],
            fetching: false,
        };

        wrapper.instance().componentDidUpdate(prevProps);
        expect(spy).toHaveBeenCalled();
    });
});
