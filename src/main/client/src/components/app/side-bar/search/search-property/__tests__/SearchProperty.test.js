import React from 'react';
import { shallow } from 'enzyme';
import SearchProperty from '../SearchProperty';
import SearchPropertyView from '../SearchPropertyView';

const setup = (prop) => {
    const minProps = {
        features: [],
        fetching: false,
    };

    const props = prop || minProps;
    const wrapper = shallow(<SearchProperty {...props} />);

    return { props, wrapper };
};

describe('<SearchProperty />', () => {
    it('render - should render view', () => {
        const { wrapper } = setup();

        expect(wrapper.find(SearchPropertyView).exists()).toBe(true);
    });

    it('handlePropertyClick - should handle single property click correctly', () => {
        const { wrapper } = setup();
        const id = '123456789';

        wrapper.setState({ activeProperty: '987654321' });
        wrapper.instance().handlePropertyClick(id);
        expect(wrapper.state('activeProperty')).toBe(id);

        wrapper.instance().handlePropertyClick(id);
        expect(wrapper.state('activeProperty')).toBe('');
    });
});
