import React from 'react';
import { mount } from 'enzyme';
import { TextInput } from '../../../../../ui/elements';
import LinkContractView from '../LinkContractView';

const setup = (prop) => {
    const minProps = {
        handleInputChange: jest.fn(),
        contractNumber: '',
        fetching: false,
        contractExists: false,
    };

    const props = prop || minProps;
    const wrapper = mount(<LinkContractView {...props} />);

    return { wrapper, minProps };
};

describe('<LinkContractView />', () => {
    it('should call handleInputChange on text input change', () => {
        const { wrapper } = setup();
        const { handleInputChange } = wrapper.props();
        wrapper.find(TextInput).simulate('change');
        expect(handleInputChange).toHaveBeenCalled();
    });
});
