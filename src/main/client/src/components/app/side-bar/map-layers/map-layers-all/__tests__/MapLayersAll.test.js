import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersAll from '../MapLayersAll';
import MapLayersAllView from '../MapLayersAllView';
import * as mapUtils from '../../../../../../utils/map';

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
        setLoading: jest.fn(),
        removeLoading: jest.fn(),
        setlayerList: jest.fn(),
        addNonSpatialContentToTable: jest.fn(),
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
        const id = 1;

        wrapper.instance().handleGroupClick(id);
        expect(wrapper.state('activeGroup')).toBe(1);
    });

    it('handleLayerClick - set layer as active (geometry layer)', async () => {
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
                    type: 'agfs',
                },
            ],
        };
        const { wrapper } = setup(props);
        const { setLoading, setLayerList } = wrapper.instance().props;

        const layerWithFields = [
            {
                id: 1,
                active: false,
                type: 'agfs',
                fields: [],
            },
        ];
        mapUtils.getLayerFields = jest.fn(() => Promise.resolve(layerWithFields));

        await wrapper.instance().handleLayerClick(1);
        expect(setLoading).toHaveBeenCalled();
        await mapUtils.getLayerFields();
        expect(setLayerList).toHaveBeenCalled();
    });

    it('handleLayerClick - set layer as active (agfl layer)', async () => {
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
        const {
            setLoading, setLayerList, removeLoading, addNonSpatialContentToTable,
        } = wrapper.instance().props;

        const layerWithFields = [
            {
                id: 1,
                active: false,
                type: 'agfl',
                fields: [],
            },
        ];
        mapUtils.getLayerFields = jest.fn(() => Promise.resolve(layerWithFields));

        await wrapper.instance().handleLayerClick(1);
        expect(setLoading).toHaveBeenCalled();
        await mapUtils.getLayerFields();
        expect(removeLoading).toHaveBeenCalled();
        expect(setLayerList).toHaveBeenCalled();
        expect(addNonSpatialContentToTable).toHaveBeenCalled();
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
        const { setLayerList, view } = wrapper.instance().props;

        const id = 1;

        await wrapper.instance().handleLayerClick(id);
        expect(setLayerList).toHaveBeenCalled();
        expect(view.popup.close).toHaveBeenCalled();
    });
});
