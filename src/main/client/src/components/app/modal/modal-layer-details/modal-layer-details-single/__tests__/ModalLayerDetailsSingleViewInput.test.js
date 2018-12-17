import React from 'react';
import { shallow } from 'enzyme';
import Select from 'react-select';

import ModalLayerDetailsSingleViewInput from '../ModalLayerDetailsSingleViewInput';
import { TextInput } from '../../../../../ui/elements';

describe('<ModalLayerDetailsSingleViewInput />', () => {
    it('should render', () => {
        const field = { name: 'test-field-1', type: 'esriFieldTypeInteger' };
        const props = { field, handleOnChange: jest.fn(), index: 1 };
        const wrapper = shallow(<ModalLayerDetailsSingleViewInput {...props} />);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('should contain <TextInput />', () => {
        const field = { name: 'test-field-1', type: 'esriFieldTypeInteger' };
        const props = { field, handleOnChange: jest.fn(), index: 1 };
        const wrapper = shallow(<ModalLayerDetailsSingleViewInput {...props} />);
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
        };
        const props = { field, handleOnChange: jest.fn(), index: 1 };
        const wrapper = shallow(<ModalLayerDetailsSingleViewInput {...props} />);
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
        };
        const props = { field, handleOnChange: jest.fn(), index: 1 };
        const wrapper = shallow(<ModalLayerDetailsSingleViewInput {...props} />);
        expect(wrapper.find(Select).length).toBe(1);
    });
});
