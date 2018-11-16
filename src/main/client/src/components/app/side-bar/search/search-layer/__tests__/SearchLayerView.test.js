import React from 'react';
import { shallow } from 'enzyme';
import SearchFieldView from '../search-field/SearchFieldView';
import SearchLayerView from '../SearchLayerView';

const setup = (prop) => {
    const minProps = {
        handleLayerChange: jest.fn(),
        handleAddField: jest.fn(),
        handleTextChange: jest.fn(),
        handleChangeField: jest.fn(),
        handleSubmit: jest.fn(),
        handleRemoveField: jest.fn(),
        selectedLayer: 0,
        queryableLayers: [{}],
        searchFieldValues: [
            {
                id: 0,
            },
        ],
        textSearch: '',
        optionsField: [{}],
        optionsExpression: [{}],
        fetching: false,
    };

    const props = prop || minProps;
    const wrapper = shallow(<SearchLayerView {...props} />);

    return { minProps, wrapper };
};

describe('<SearchLayerView />', () => {
    it('should contain three (3) SearchVieldViews', () => {
        const { minProps } = setup();
        const props = {
            ...minProps,
            searchFieldValues: [
                {
                    id: 0,
                    value: 1,
                    queryText: '',
                    queryExpression: '',
                },
                {
                    id: 1,
                    value: 2,
                    queryText: '',
                    queryExpression: '',
                },
                {
                    id: 2,
                    value: 3,
                    queryText: '',
                    queryExpression: '',
                },
            ],
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(SearchFieldView).length).toBe(3);
    });
});
