import React from 'react';
import { mount } from 'enzyme';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayersActiveView from '../MapLayersActiveView';

const setup = () => {
    const props = {
        mapLayerList: [
            {
                id: 1,
                active: false,
                name: 'Layer 1',
                type: 'agfs',
                _source: 'search',
                layerPermission: {
                    createLayer: true,
                    readLayer: true,
                    updateLayer: false,
                    deleteLayer: false,
                },
            },
            {
                id: 2,
                active: true,
                name: 'Layer 2',
                type: 'agfs',
                _source: 'select',
                layerPermission: {
                    createLayer: true,
                    readLayer: true,
                    updateLayer: false,
                    deleteLayer: false,
                },
            },
            {
                id: 3,
                active: false,
                name: 'Layer 3',
                type: 'wms',
                _source: 'select',
                layerPermission: {
                    createLayer: true,
                    readLayer: true,
                    updateLayer: false,
                    deleteLayer: false,
                },
            },
            {
                id: 4,
                active: true,
                name: 'Layer 4',
                type: 'wmts',
                _source: 'search',
            },
            {
                id: 5,
                active: true,
                name: 'Layer 5',
                type: 'agfs',
                _source: 'select',
                layerPermission: {
                    createLayer: true,
                    readLayer: true,
                    updateLayer: false,
                    deleteLayer: false,
                },
            },
        ],
        dataLayerList: [
            {
                id: 6,
                active: false,
                name: 'Layer 6',
                type: 'agfl',
                _source: 'search',
            },
            {
                id: 7,
                active: true,
                name: 'Layer 7',
                type: 'agfl',
                _source: 'select',
                layerPermission: {
                    createLayer: true,
                    readLayer: true,
                    updateLayer: false,
                    deleteLayer: false,
                },
            },
        ],
        setActiveAdminTool: jest.fn(),
        onDragEnd: () => {},
        toggleLayer: jest.fn(),
    };
    const wrapper = mount(<MapLayersActiveView {...props} />);

    return { props, wrapper };
};

describe('<MapLayersActiveView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.find(DragDropContext).length).toBe(1);
    });

    it('should render active layers only', () => {
        expect(wrapper.find(Droppable).exists()).toBe(true);
        expect(wrapper.find(Draggable).exists()).toBe(true);
        expect(wrapper.find(LayerSettings).length).toBe(3);
    });

    it('should set active admintool on click', () => {
        const { setActiveAdminTool } = wrapper.props();
        expect(wrapper.find(LayerSettings.Icons).find('i')).toHaveLength(4);
        wrapper.find(LayerSettings.Icons).find('i').at(1).simulate('click');
        expect(setActiveAdminTool).toHaveBeenCalled();
    });

    it('should call toggleLayer on visibility click', () => {
        const { toggleLayer } = wrapper.props();

        wrapper.find(LayerSettings.Toggle).at(0).simulate('click');
        expect(toggleLayer).toHaveBeenCalled();
    });
});
