import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersActive from '../MapLayersActive';
import MapLayersActiveView from '../MapLayersActiveView';

const setup = (prop) => {
    const minProps = {
        layerList: [],
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
            layerGroups: {
                activeLayers: [],
                layerGroups: [],
                fetching: false,
            },
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
});
