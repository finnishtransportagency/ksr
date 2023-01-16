import React from 'react';
import { shallow } from 'enzyme';
import DataLayersActiveView from '../DataLayersActiveView';
import MapLayerSettings from '../../map-layer-settings/MapLayerSettings';

describe('<DataLayersActiveView />', () => {
    it('it should render nothing', () => {
        const props = {
            dataLayerList: [],
            setActiveAdminTool: () => {},
            createNonSpatialFeature: () => {},
            activeAdminTool: '',
        };

        const wrapper = shallow(<DataLayersActiveView {...props} />);
        expect(wrapper.getElement()).toBe(null);
    });

    it('should render two (2) <MapLayerSettings />', () => {
        const props = {
            dataLayerList: [
                {
                    id: 1,
                    active: true,
                    name: 'Layer 1',
                },
                {
                    id: 2,
                    active: true,
                    name: 'Layer 2',
                },
            ],
            setActiveAdminTool: () => {},
            createNonSpatialFeature: () => {},
            activeAdminTool: '',
        };

        const wrapper = shallow(<DataLayersActiveView {...props} />);
        expect(wrapper.find(MapLayerSettings).length).toBe(2);
    });
});
