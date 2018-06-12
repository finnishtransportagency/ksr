import React from 'react';
import { shallow } from 'enzyme';
import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import MapLayersAllView from '../MapLayersAllView';

const setup = () => {
    const props = {
        layerGroups: [
            {
                name: 'layer group 1',
                layers: [
                    {
                        visible: 1, name: 'layer 1',
                    },
                    {
                        visible: 1, name: 'layer 2',
                    },
                ],
            },
        ],
        handleGroupClick: () => {},
        activeGroup: 1,
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
