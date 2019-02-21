import React from 'react';
import { shallow } from 'enzyme';
import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import MapLayersAllView from '../MapLayersAllView';

const setup = () => {
    const props = {
        layerGroups: [
            {
                id: 1,
                name: 'layer group 1',
                layers: [
                    {
                        id: 1, visible: true, name: 'layer 1', active: true,
                    },
                    {
                        id: 2, visible: true, name: 'layer 2', active: true,
                    },
                ],
            },
        ],
        layerList: [
            {
                id: 1, visible: true, name: 'Layer 1', active: true,
            },
            {
                id: 2, visible: true, name: 'Layer 2', active: true,
            },
        ],
        loadingLayers: [],
        handleGroupClick: () => {},
        activeGroups: [1],
    };
    const wrapper = shallow(<MapLayersAllView {...props} />);

    return { props, wrapper };
};

describe('<MapLayersAllView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(LayerGroup).length).toBe(1);
    });
});
