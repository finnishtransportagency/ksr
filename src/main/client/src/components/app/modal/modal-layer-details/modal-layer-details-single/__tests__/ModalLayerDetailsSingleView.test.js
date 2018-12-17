import React from 'react';
import { shallow } from 'enzyme';
import ModalLayerDetailsSingleView from '../ModalLayerDetailsSingleView';
import ModalLayerDetailsSingleViewInput from '../ModalLayerDetailsSingleViewInput';

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

    const wrapper = shallow(<ModalLayerDetailsSingleView {...props} />);

    return { wrapper };
};

describe('<ModalLayerDetailsSingleView />', () => {
    const { wrapper } = setup();

    it('should render self', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('contains <TextInput />', () => {
        expect(wrapper.find(ModalLayerDetailsSingleViewInput).length).toBe(1);
    });
});
