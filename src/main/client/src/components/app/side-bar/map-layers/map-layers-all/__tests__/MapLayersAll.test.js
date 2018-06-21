import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersAll from '../MapLayersAll';
import MapLayersAllView from '../MapLayersAllView';

const setup = (prop) => {
    const minProps = {
        layerGroups: [],
        layerList: [
            {
                id: 1,
                active: true,
            },
            {
                id: 1,
                active: true,
            },
        ],
        fetching: true,
        setLayerList: jest.fn(),
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

    it('should handle handleLayerClick correctly', () => {
        const { wrapper } = setup();
        const { setLayerList } = wrapper.instance().props;

        const id = 1;

        wrapper.instance().handleLayerClick(id);
        expect(setLayerList).toHaveBeenCalled();
    });
});
