import React from 'react';
import { mount } from 'enzyme';
import ModalThemeLayerView from '../ModalThemeLayerView';
import Radiobutton from '../../../../ui/blocks/Radiobutton';
import { TextInput } from '../../../../ui/elements';

const setup = (prop) => {
    const minProps = {
        handleFieldChange: jest.fn(),
        handleClassificationChange: jest.fn(),
        handleInputChange: jest.fn(),
        selectedField: '',
        selectedClassification: '',
        numClasses: 0,
        layerFields: [{}],
    };
    const props = prop || minProps;
    const wrapper = mount(<ModalThemeLayerView {...props} />);

    return { props, wrapper };
};

describe.skip('<ModalThemeLayerView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should render four Radiobuttons', () => {
        expect(wrapper.find(Radiobutton)).toHaveLength(4);
    });

    it('should handle radio change', () => {
        const { handleClassificationChange } = wrapper.props();
        const event = { target: { value: 'natural-breaks' } };

        expect(handleClassificationChange).not.toHaveBeenCalled();
        wrapper.find(Radiobutton.Input).at(1).simulate('change', event);
        expect(handleClassificationChange).toHaveBeenCalled();
    });

    it('should handle TextInput change', () => {
        wrapper.find(TextInput).simulate('change');
        const { handleInputChange } = wrapper.props();
        expect(handleInputChange).toHaveBeenCalled();
    });
});
