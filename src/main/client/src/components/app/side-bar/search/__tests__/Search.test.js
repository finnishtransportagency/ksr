import React from 'react';
import { shallow } from 'enzyme';
import Search from '../Search';
import SearchView from '../SearchView';

const setup = () => {
    const props = {
        setSearchState: jest.fn(),
        searchState: {},
        activeSearch: '',
        setActiveSearch: jest.fn(),
    };
    const wrapper = shallow(<Search {...props} />);

    return { wrapper };
};

describe.skip('<Search />', () => {
    const { wrapper } = setup();

    it('render - should render view ', () => {
        expect(wrapper.find(SearchView).exists()).toBe(true);
    });

    it('handleRadioChange - should change active search', () => {
        const { setActiveSearch } = wrapper.instance().props;
        const evt = {
            target: {
                value: 'layer',
            },
        };
        wrapper.instance().handleRadioChange(evt);

        expect(setActiveSearch).toHaveBeenCalled();
    });
});
