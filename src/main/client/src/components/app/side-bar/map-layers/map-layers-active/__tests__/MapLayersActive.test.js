import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersActive from '../MapLayersActive';
import MapLayersActiveView from '../MapLayersActiveView';

const setup = (prop) => {
    const minProps = {
        layerList: [
            {
                id: 1,
                opacity: 1,
            },
            {
                id: 2,
                opacity: 1,
            },
        ],
        fetching: true,
        setLayerList: jest.fn(),
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
            activeLayers: [],
            layerGroups: [],
            fetching: false,
        };

        const { wrapper } = setup(props);
        expect(wrapper.find(MapLayersActiveView).exists()).toBe(true);
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
        const { setLayerList, layerList } = wrapper.instance().props;
        const newOpacity = 0.7;
        const id = 2;
        const foundIndex = layerList.findIndex(layer => layer.id === id);

        expect(layerList[foundIndex].opacity).toBe(1);
        wrapper.instance().onOpacityChange(newOpacity, id);
        expect(setLayerList).toHaveBeenCalled();
        expect(layerList[foundIndex].opacity).toBe(0.7);
    });
});
