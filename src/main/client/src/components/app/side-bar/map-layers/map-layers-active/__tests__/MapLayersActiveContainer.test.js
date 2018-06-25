import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import React from 'react';

import MapLayersActive from './../MapLayersActive';
import MapLayersActiveContainer from './../MapLayersActiveContainer';

const testState = {
    map: {
        layerGroups: {
            layerList: [
                {
                    id: 1,
                    active: false,
                    name: 'Layer 1',
                },
                {
                    id: 2,
                    active: true,
                    name: 'Layer 2',
                },
                {
                    id: 3,
                    active: false,
                    name: 'Layer 3',
                },
                {
                    id: 4,
                    active: true,
                    name: 'Layer 4',
                },
                {
                    id: 5,
                    active: true,
                    name: 'Layer 5',
                },
            ],
        },
        fetching: false,
    },
};

describe('<MapLayersActiveContainer />', () => {
    it('should include all layers in layerList', () => {
        const store = createMockStore(testState);
        const container = shallow(<MapLayersActiveContainer store={store} />);
        expect(container.find(MapLayersActive).exists()).toBe(true);
        expect(container.find(MapLayersActive).props().layerList.length).toBe(5);
    });
});
