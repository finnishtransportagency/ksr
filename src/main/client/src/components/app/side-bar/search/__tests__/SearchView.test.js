import React from 'react';
import { shallow } from 'enzyme';
import Radiobutton from '../../../../ui/blocks/Radiobutton';
import SearchLayerContainer from '../search-layer/SearchLayerContainer';
import SearchPropertyContainer from '../search-property/SearchPropertyContainer';
import SearchView from '../SearchView';

const setup = (prop) => {
    const minProps = {
        suggestionsActive: true,
        toggleSearchSuggestions: jest.fn(),
        handleRadioChange: jest.fn(),
        activeSearch: 'layer',
    };

    const props = prop || minProps;
    const wrapper = shallow(<SearchView {...props} />);

    return { wrapper };
};

describe('<Search />', () => {
    it('render - should render layer search ', () => {
        const props = {
            suggestionsActive: true,
            toggleSearchSuggestions: jest.fn(),
            handleRadioChange: jest.fn(),
            activeSearch: 'layer',
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(SearchLayerContainer).exists()).toBe(true);
    });

    it('render - should render property search', () => {
        const props = {
            suggestionsActive: false,
            toggleSearchSuggestions: jest.fn(),
            handleRadioChange: jest.fn(),
            activeSearch: 'property',
        };
        const { wrapper } = setup(props);

        expect(wrapper.find(SearchPropertyContainer).exists()).toBe(true);
    });

    it('render - should render two (2) Radiobuttons', () => {
        const { wrapper } = setup();

        expect(wrapper.find(Radiobutton)).toHaveLength(2);
    });
});
