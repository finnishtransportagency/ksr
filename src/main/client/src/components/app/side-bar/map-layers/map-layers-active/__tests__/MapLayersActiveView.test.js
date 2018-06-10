import React from 'react';
import { shallow } from 'enzyme';
import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayersActiveView from '../MapLayersActiveView';

function setup() {
    const props = {
        activeLayers: [
            [
                {
                    name: 'layer 1',
                },
            ],
            [
                {
                    name: 'layer 2',
                },
            ],
        ],
    };
    const wrapper = shallow(<MapLayersActiveView {...props} />);

    return { props, wrapper };
}

describe('<MapLayersActiveView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(LayerSettings).length).toBe(2);
    });
});
