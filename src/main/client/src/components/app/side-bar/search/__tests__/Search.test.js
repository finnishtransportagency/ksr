import React from 'react';
import { shallow } from 'enzyme';
import Search from '../Search';
import SearchView from '../SearchView';

const setup = (prop) => {
    const minProps = {
        searchFeatures: jest.fn(),
        setSearchState: jest.fn(),
        setSearchOptions: jest.fn(),
        layerList: [{}],
        queryableLayers: [{
            value: 0,
            label: 'Layer 1',
        }],
        searchState: {
            selectedLayer: 0,
            textSearch: '',
            searchFieldValues: [{}],
            optionsField: [{}],
            optionsExpression: [{}],
            fetching: false,
        },
    };

    const props = prop || minProps;
    const wrapper = shallow(<Search {...props} />);

    return { minProps, wrapper };
};

describe('<Search />', () => {

    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(SearchView).exists()).toBe(true);
    });

    it('should invoke handleLayerChange correctly', () => {
        const { wrapper } = setup();
        const { setSearchState, setSearchOptions } = wrapper.instance().props;

        wrapper.instance().handleLayerChange(0);
        wrapper.instance().handleLayerChange(1);

        expect(setSearchState).toHaveBeenCalledTimes(2);
        expect(setSearchOptions).toHaveBeenCalledTimes(1);
    });

    it('should invoke handleTextChange correctly', () => {
        const { wrapper } = setup();
        const { setSearchState } = wrapper.instance().props;
        const evt = {
            target: {
                value: 'text',
            },
        };

        wrapper.instance().handleTextChange(evt);

        expect(setSearchState).toHaveBeenCalled();
    });

    it('should invoke handleAddField correctly', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            searchState: {
                optionsField: [
                    {
                        value: 1,
                        label: 'fieldName1',
                    },
                ],
                searchFieldValues: [
                    {
                        value: 1,
                        queryText: '',
                        queryExpression: '',
                    },
                    {
                        value: 2,
                        queryText: '',
                        queryExpression: '',
                    },
                ],
            },
        };

        const { wrapper } = setup(props);
        const { setSearchState } = wrapper.instance().props;

        wrapper.instance().handleAddField(1);

        expect(setSearchState).toHaveBeenCalled();
    });

    it('should invoke handleChangeField correctly', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            searchState: {
                searchFieldValues: [
                    {
                        value: 1,
                        queryText: '',
                        queryExpression: '',
                    },
                    {
                        value: 2,
                        queryText: '',
                        queryExpression: '',
                    },
                ],
            },
        };

        const { wrapper } = setup(props);
        const { setSearchState } = wrapper.instance().props;

        let evt = {
            target: {
                value: 'text',
            },
        };
        wrapper.instance().handleChangeField('text', evt, 1);

        evt = {
            target: {
                value: '%',
            },
        };
        wrapper.instance().handleChangeField('expression', evt, 0);

        expect(setSearchState).toHaveBeenCalledTimes(2);
    });

    it('should invoke handleRemoveField correctly', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            searchState: {
                searchFieldValues: [
                    {
                        value: 1,
                        queryText: '',
                        queryExpression: '',
                    },
                    {
                        value: 2,
                        queryText: '',
                        queryExpression: '',
                    },
                ],
            },
        };

        const { wrapper } = setup(props);
        const { setSearchState } = wrapper.instance().props;

        wrapper.instance().handleRemoveField(1);

        expect(setSearchState).toHaveBeenCalled();
    });

    it('should invoke handleSubmit correctly', () => {
        const { wrapper } = setup();
        const { searchFeatures } = wrapper.instance().props;

        const evt = {
            preventDefault: () => {},
        };
        wrapper.instance().handleSubmit(evt);

        expect(searchFeatures).toHaveBeenCalled();
    });
});
