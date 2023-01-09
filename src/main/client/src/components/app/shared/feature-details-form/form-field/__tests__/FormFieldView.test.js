import React from 'react';
import { shallow } from 'enzyme';
import FieldInputView from '../field-input/FieldInputView';
import FormFieldView from '../FormFieldView';

const setup = () => {
    const props = {
        index: 1,
        field: {
            name: 'name',
            type: 'esriFieldTypeString',
        },
        handleOnChange: jest.fn(),
        fetching: false,
        contractExists: true,
    };

    const wrapper = shallow(<FormFieldView {...props} />);

    return { wrapper };
};

describe.skip('<FormFieldView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <FieldInputView />', () => {
        expect(wrapper.find(FieldInputView).length).toBe(1);
    });
});
