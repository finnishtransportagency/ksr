import React from 'react';
import { shallow } from 'enzyme';
import ModalLayerDetailsSingleView from '../ModalLayerDetailsSingleView';
import { TextInput } from '../../../../../../../ui/elements';

const setup = () => {
    const props = {
        index: 1,
        field: {
            name: 'name',
            type: 'esriFieldTypeString',
        },
        handleOnChange: jest.fn(),
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
        expect(wrapper.find(TextInput).length).toBe(1);
    });
});
