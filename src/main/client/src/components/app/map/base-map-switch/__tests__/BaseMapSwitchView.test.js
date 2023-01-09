import React from 'react';
import { shallow } from 'enzyme';
import BaseMapSwitchView from '../BaseMapSwitchView';

describe.skip('<BaseMapSwitchView />', () => {
    const setup = () => {
        const props = {
            layers: [
                {
                    id: '1', name: 'Layer 1', active: true, visible: true,
                },
                {
                    id: '2', name: 'Layer 2', active: false, visible: false,
                },
                {
                    id: '3', name: 'Layer 3', active: true, visible: false,
                },
                {
                    id: '4', name: 'Layer 4', active: true, visible: true,
                },
            ],
            tableOpen: false,
            sideBarOpen: false,
            adminToolActive: false,
            toggleLayer: jest.fn(),
            loadingLayers: [],
        };

        return {
            wrapper: shallow(<BaseMapSwitchView {...props} />),
            props,
        };
    };

    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should contain <BaseMapContainer />', () => {
        const { wrapper } = setup();
        expect(wrapper.find('BaseMapContainer').length).toBe(1);
    });

    it('should contain four (4) <BaseMapButton />', () => {
        const { wrapper } = setup();
        expect(wrapper.find('BaseMapButton').length).toBe(4);
    });
});
