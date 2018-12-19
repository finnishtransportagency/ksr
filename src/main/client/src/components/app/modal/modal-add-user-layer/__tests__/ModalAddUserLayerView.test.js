import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../../../ui/blocks/Checkbox';
import { TextInput } from '../../../../ui/elements';
import { InputWithIcon } from '../../../../ui/elements/TextInput';
import { CheckboxWrapper } from '../../modal-filter/styles';
import ModalAddUserLayerView from '../ModalAddUserLayerView';
import { RadioWrapper, SliderWrapper, Wrapper } from '../styles';

const setup = () => {
    const props = {
        handleInputChange: jest.fn(),
        handleTypeChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleOpacityChange: jest.fn(),
        layerValues: {
            name: '',
            type: '',
            url: '',
            layers: '',
            opacity: 1,
            minScale: 577790,
            maxScale: 9027,
            transparent: false,
            attribution: '',
            desktopVisible: true,
            mobileVisible: true,
            styles: '',
            queryable: '0',
            queryColumns: '',
        },
        optionsType: [
            {
                value: 'agfs',
                label: 'ArcGIS Feature Service',
            },
            {
                value: 'wms',
                label: 'Web Map Service',
            },
            {
                value: 'wmts',
                label: 'Web Map Tile Service',
            },
        ],
    };
    const wrapper = mount(<ModalAddUserLayerView {...props} />);

    return { props, wrapper };
};

describe('<ModalAddUserLayerView />', () => {
    const { wrapper } = setup();

    it('should render eight (8) InputWrappers', () => {
        expect(wrapper.find(InputWithIcon).length).toBe(7);
    });

    it('should render three (3) CheckboxWrapper', () => {
        expect(wrapper.find(CheckboxWrapper).length).toBe(3);
    });

    it('should render one (1) SliderWrapper', () => {
        expect(wrapper.find(SliderWrapper).length).toBe(1);
    });

    it('should invoke handleInputChange when TextInput changed', () => {
        wrapper.find(TextInput).forEach(input => input.simulate('change'));
        const { handleInputChange } = wrapper.props();
        expect(handleInputChange).toHaveBeenCalledTimes(7);
    });

    it('should invoke handleCheckboxChange when Checkbox changed', () => {
        wrapper.find(Checkbox.Input).forEach(input => input.simulate('change'));
        const { handleCheckboxChange } = wrapper.props();
        expect(handleCheckboxChange).toHaveBeenCalledTimes(3);
    });

    it('should render one (1) Wrapper', () => {
        expect(wrapper.find(Wrapper).length).toBe(1);
    });
    it('should render one (1) RadioWrapper', () => {
        expect(wrapper.find(RadioWrapper).length).toBe(1);
    });
});
