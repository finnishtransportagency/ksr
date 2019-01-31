import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersActive from '../MapLayersActive';
import MapLayersActiveView from '../MapLayersActiveView';
import DataLayersActiveView from '../data-layers-active/DataLayersActiveView';

const setup = (prop) => {
    const minProps = {
        mapLayerList: [
            {
                id: 1,
                opacity: 1,
                visible: true,
            },
            {
                id: 2,
                opacity: 1,
                visible: true,
            },
        ],
        dataLayerList: [
            {
                id: 3,
                visible: true,
            },
        ],
        fetching: true,
        setLayerList: jest.fn(),
        activateLayers: jest.fn(),
        deactivateLayer: jest.fn(),
    };

    const props = prop || minProps;
    const wrapper = shallow(<MapLayersActive {...props} />);

    return { props, wrapper };
};

describe('<MapLayersActive />', () => {
    it('should render LoadingIcon if fetching data', () => {
        const { wrapper } = setup();
        expect(wrapper.find(LoadingIcon).exists()).toBe(true);
    });

    it('should render view if fetching completed', () => {
        const props = {
            mapLayerList: [],
            dataLayerList: [],
            fetching: false,
        };

        const { wrapper } = setup(props);
        expect(wrapper.find(MapLayersActiveView).exists()).toBe(true);
        expect(wrapper.find(DataLayersActiveView).exists()).toBe(true);
    });

    it('should handle onDragEnd correctly', () => {
        const { wrapper } = setup();
        const { setLayerList } = wrapper.instance().props;

        const result = {
            destination: {
                index: 2,
            },
            source: {
                index: 1,
            },
        };

        wrapper.instance().onDragEnd(result);
        expect(setLayerList).toHaveBeenCalled();
    });

    it('should handle onOpacityChange correctly', () => {
        const { wrapper } = setup();
        const { setLayerList, mapLayerList } = wrapper.instance().props;
        const newOpacity = 0.7;
        const id = 2;
        const foundLayer = mapLayerList.find(layer => layer.id === id);

        expect(foundLayer.opacity).toBe(1);
        wrapper.instance().onOpacityChange(newOpacity, id);
        expect(setLayerList).toHaveBeenCalled();
        expect(foundLayer.opacity).toBe(0.7);
    });
});
