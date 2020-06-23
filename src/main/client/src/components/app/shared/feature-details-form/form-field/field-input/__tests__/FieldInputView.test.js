import React from 'react';
import { shallow } from 'enzyme';
import Select from 'react-select';
import { TextInput } from '../../../../../../ui/elements';
import FieldInputView from '../FieldInputView';

describe('<FieldInputView />', () => {
    it('should render', () => {
        const field = { name: 'test-field-1', type: 'esriFieldTypeInteger', data: 'test' };
        const props = { field, handleOnChange: jest.fn(), index: 1 };
        const wrapper = shallow(<FieldInputView {...props} />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should contain <TextInput />', () => {
        const field = { name: 'test-field-1', type: 'esriFieldTypeInteger', data: 0 };
        const props = { field, handleOnChange: jest.fn(), index: 1 };
        const wrapper = shallow(<FieldInputView {...props} />);
        expect(wrapper.find(TextInput).length).toBe(1);
    });

    it('should contain <Select />', () => {
        const field = {
            name: 'test-field-1',
            type: 'esriFieldTypeInteger',
            domain: {
                type: 'coded-value',
                codedValues: [],
            },
            data: '0',
        };
        const props = {
            field, handleOnChange: jest.fn(), index: 1,
        };
        const wrapper = shallow(<FieldInputView {...props} />);
        expect(wrapper.find(Select).length).toBe(1);
    });

    it('should contain <Select />', () => {
        const field = {
            name: 'test-field-1',
            type: 'esriFieldTypeInteger',
            domain: {
                type: 'codedValue',
                codedValues: [],
            },
            data: 'test',
        };
        const props = {
            field, handleOnChange: jest.fn(), index: 1,
        };
        const wrapper = shallow(<FieldInputView {...props} />);
        expect(wrapper.find(Select).length).toBe(1);
    });
});
