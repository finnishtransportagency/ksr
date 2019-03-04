import React from 'react';
import { shallow } from 'enzyme';
import MapLayerView from '../MapLayerView';
import LayerGroup from '../../../../../../ui/blocks/LayerGroup';
import strings from '../../../../../../../translations/fi';

const setup = (prop) => {
    const minProps = {
        layer: {
            id: 12,
            name: 'Test layer 1',
            userLayer: false,
        },
        layerGroupName: 'Testi',
        handleLayerClick: jest.fn(),
        checked: true,
        loadingLayers: [],
        layerList: [
            {
                id: 12,
                name: 'Test layer 1',
                userLayer: false,
                failOnLoad: false,
            },
        ],
    };

    const props = prop || minProps;
    const wrapper = shallow(<MapLayerView {...props} />);

    return { props, wrapper };
};

describe('<MapLayerView />', () => {
    it('should render', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBe(true);
    });

    it('should render checked', () => {
        const { wrapper } = setup();
        const checkbox = wrapper.find({ type: 'checkbox' });
        expect(checkbox.props().checked).toBe(true);
    });

    it('should render unchecked', () => {
        const props = {
            layer: {
                id: 1234,
                name: 'Test Layer 2',
                userLayer: false,
            },
            layerGroupName: 'Testi',
            handleLayerClick: jest.fn(),
            checked: false,
            loadingLayers: [],
            layerList: [
                {
                    id: 1234,
                    name: 'Test layer 2',
                    userLayer: false,
                    failOnLoad: false,
                },
            ],
        };
        const { wrapper } = setup(props);
        const checkbox = wrapper.find({ type: 'checkbox' });
        expect(checkbox.props().checked).toBe(false);
    });

    it('should render <LayerGroup.Layer>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LayerGroup.Layer).exists()).toBe(true);
    });

    it('should render <LayerGroup.Layer.Label>', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LayerGroup.Layer.Label).exists()).toBe(true);
    });

    it('should render <LayerGroup.Layer.RemoveIcon> if userLayer', () => {
        const props = {
            layer: {
                id: 1234,
                name: 'Test Layer 2',
                userLayer: true,
            },
            layerGroupName: strings.mapLayers.userLayerGroupName,
            handleLayerClick: jest.fn(),
            checked: true,
            loadingLayers: [],
            layerList: [
                {
                    id: 1234,
                    name: 'Test layer 2',
                    userLayer: true,
                },
            ],
        };
        const { wrapper } = setup(props);
        expect(wrapper.find(LayerGroup.Layer.RemoveIcon).exists()).toBe(true);
    });

    it('should not render <LayerGroup.Layer.RemoveIcon> if not userLayer', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LayerGroup.Layer.RemoveIcon).exists()).toBe(false);
    });

    it('should fire onChange event', () => {
        const { props, wrapper } = setup();
        const event = { target: { checked: false } };
        const checkbox = wrapper.find({ type: 'checkbox' });

        checkbox.simulate('change', event);
        expect(props.handleLayerClick).toHaveBeenCalled();
    });
});
