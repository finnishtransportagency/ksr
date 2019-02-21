import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersAll from '../MapLayersAll';
import MapLayersAllView from '../MapLayersAllView';

const setup = (prop) => {
    const minProps = {
        layerGroups: [
            {
                id: 123,
                name: 'Test layergroup',
                layers: [
                    { id: 1, active: false },
                    { id: 2, active: false },
                ],
            },
        ],
        layerList: [
            {
                id: 1,
                active: false,
            },
            {
                id: 2,
                active: true,
            },
        ],
        fetching: true,
        setLayerList: jest.fn(),
        view: {
            popup: { close: jest.fn() },
        },
        setlayerList: jest.fn(),
        addNonSpatialContentToTable: jest.fn(),
        activateLayers: jest.fn(),
        deactivateLayer: jest.fn(),
        activeGroups: [],
        activeSubGroups: [],
        setActiveGroups: jest.fn(),
        setActiveSubGroups: jest.fn(),
    };

    const props = prop || minProps;
    const wrapper = shallow(<MapLayersAll {...props} />);

    return { props, wrapper };
};

describe('<MapLayersAll />', () => {
    it('should render LoadingIcon if fetching data', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LoadingIcon).exists()).toBe(true);
    });

    it('should render view if fetching completed', () => {
        const props = {
            layerGroups: [],
            layerList: [],
            fetching: false,
        };

        const { wrapper } = setup(props);
        expect(wrapper.find(MapLayersAllView).exists()).toBe(true);
    });

    it('should handle handleGroupClick correctly', () => {
        const { wrapper } = setup();
        const { setActiveGroups } = wrapper.instance().props;

        wrapper.instance().handleGroupClick(1);
        expect(setActiveGroups).toHaveBeenCalled();
    });

    it('should handle handleSubGroupClick correctly', () => {
        const { wrapper } = setup();
        const { setActiveSubGroups } = wrapper.instance().props;

        wrapper.instance().handleSubGroupClick(1);
        expect(setActiveSubGroups).toHaveBeenCalled();
    });

    it('handleLayerClick - set layer as active', async () => {
        const { props: minProps } = setup();
        const props = {
            ...minProps,
            layerGroups: [
                {
                    id: 123,
                    name: 'Test layergroup',
                    layers: [
                        { id: 1, active: false },
                    ],
                },
            ],
            layerList: [
                {
                    id: 1,
                    active: false,
                    type: 'agfl',
                },
            ],
        };
        const { wrapper } = setup(props);
        const { activateLayers } = wrapper.instance().props;

        wrapper.instance().handleLayerClick(1);
        expect(activateLayers).toHaveBeenCalled();
    });

    it('handleLayerClick - disable layer', async () => {
        const { props: minProps } = setup();
        const props = {
            ...minProps,
            layerGroups: [
                {
                    id: 123,
                    name: 'Test layergroup',
                    layers: [
                        { id: 1, active: true },
                        { id: 2, active: true },
                    ],
                },
            ],
            layerList: [
                {
                    id: 1,
                    active: true,
                },
                {
                    id: 2,
                    active: true,
                },
            ],
        };

        const { wrapper } = setup(props);
        const { deactivateLayer } = wrapper.instance().props;

        const id = 1;

        wrapper.instance().handleLayerClick(id);
        expect(deactivateLayer).toHaveBeenCalled();
    });
});
