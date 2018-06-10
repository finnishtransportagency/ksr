import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayersActive from '../MapLayersActive';
import MapLayersActiveView from '../MapLayersActiveView';

const setup = (prop) => {
    const minProps = {
        getActiveLayers: () => {},
        activeLayers: {
            activeLayers: [],
            fetching: true,
        },
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
            getActiveLayers: () => {},
            activeLayers: {
                activeLayers: [],
                fetching: false,
            },
        };

        const { wrapper } = setup(props);
        expect(wrapper.find(MapLayersActiveView).exists()).toBe(true);
    });
});
