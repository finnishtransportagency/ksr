import React from 'react';
import { shallow } from 'enzyme';
import SubLayerView from '../SubLayerView';
import Checkbox from '../../../../../../ui/blocks/Checkbox';
import LayerGroup from '../../../../../../ui/blocks/LayerGroup';

const setup = (prop) => {
    const minProps = {
        layer: {
            id: 1,
            name: 'Layer 1',
            active: false,
        },
        handleLayerClick: jest.fn(),
        layerList: [
            {
                id: 1, visible: true, name: 'Layer 1', active: true,
            },
            {
                id: 2, visible: true, name: 'Layer 2', active: false,
            },
            {
                id: 10, visible: true, name: 'Layer 10', active: false, parentLayer: 1,
            },
            {
                id: 20, visible: true, name: 'Layer 20', active: false, parentLayer: 1,
            },
        ],
        subLayers: [
            {
                id: 10, visible: true, name: 'Layer 10', active: false, parentLayer: 1,
            },
            {
                id: 20, visible: true, name: 'Layer 20', active: false, parentLayer: 1,
            },
        ],
        activeSubGroups: [],
        handleSubGroupClick: jest.fn(),
        handleSubLayerGroupClick: jest.fn(),
        loadingLayers: [],
        layersToFind: '',
    };

    const props = prop || minProps;
    const wrapper = shallow(<SubLayerView {...props} />);

    return { props, wrapper };
};

describe('<SubLayerView />', () => {
    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBe(true);
    });

    it('should render <Checkbox>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(Checkbox).exists()).toBe(true);
    });

    it('should render <Checkbox.Input>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(Checkbox.Input).exists()).toBe(true);
    });

    it('should render <Checkbox.Input>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(Checkbox.Input).exists()).toBe(true);
    });

    it('should render <LayerGroup.Layer.Label>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LayerGroup.Layer.Label).exists()).toBe(true);
    });
    it('should render <LayerGroup.Header>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LayerGroup.Header).exists()).toBe(true);
    });

    it('should fire onChange event', () => {
        const { props, wrapper } = setup();
        const event = { target: { layer: { id: 1 } } };
        const checkbox = wrapper.find({ type: 'checkbox' }).at(1);

        checkbox.simulate('change', event);
        expect(props.handleSubLayerGroupClick).toHaveBeenCalled();
        expect(props.subLayers.every(l => l.active === true));
    });
});
