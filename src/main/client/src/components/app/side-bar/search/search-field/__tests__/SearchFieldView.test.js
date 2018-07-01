import React from 'react';
import { shallow } from 'enzyme';
import SearchFieldView from '../SearchFieldView';
import SearchFieldWrapper from '../styles';

const setup = (prop) => {
    const minProps = {
        field: {},
        index: 0,
        handleChangeField: jest.fn(),
        optionsExpression: [{}],
        handleRemoveField: jest.fn(),
        fetching: false,
    };

    const props = prop || minProps;
    const wrapper = shallow(<SearchFieldView {...props} />);

    return { minProps, wrapper };
};

describe('<SearchView />', () => {
    it('should render self', () => {
        const { wrapper } = setup();

        expect(wrapper.find(SearchFieldWrapper).exists()).toBe(true);
    });
});
