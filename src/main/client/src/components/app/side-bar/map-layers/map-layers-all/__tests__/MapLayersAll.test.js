import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersAll from '../MapLayersAll';
import MapLayersAllView from '../MapLayersAllView';

const setup = (prop) => {
    const minProps = {
        layerGroups: {
            layerGroups: [],
            fetching: true,
        },
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
            layerGroups: {
                layerGroups: [],
                fetching: false,
            },
        };

        const { wrapper } = setup(props);
        expect(wrapper.find(MapLayersAllView).exists()).toBe(true);
    });
});
