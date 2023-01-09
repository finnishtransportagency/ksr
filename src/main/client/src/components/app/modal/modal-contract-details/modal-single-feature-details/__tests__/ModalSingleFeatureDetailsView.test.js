import React from 'react';
import { mount } from 'enzyme';
import strings from '../../../../../../translations';
import ModalSingleFeatureDetailsView from '../ModalSingleFeatureDetailsView';
import ContractFeatureAttribute from '../../../../../ui/blocks/ContractFeatureAttribute';

const setup = (prop) => {
    const minProps = {
        featureAttributes: [],
    };

    const props = prop || minProps;
    const wrapper = mount(<ModalSingleFeatureDetailsView {...props} />);

    return { wrapper, minProps };
};

describe.skip('<ModalSingleFeatureDetailsView />', () => {
    it('render - should show error text if no attributes found', () => {
        const { wrapper } = setup();

        expect(wrapper.find('p').length).toBe(1);
        expect(wrapper.find(ContractFeatureAttribute).length).toBe(0);

        expect(wrapper.find('p').text()).toBe(strings.modalContractDetails.errorNoAttributesFound);
    });

    it('render - should render all non-empty values', () => {
        const props = {
            featureAttributes: [
                { name: 'Name 1', label: 'Label 1', value: 123 },
                { name: 'Name 2', label: 'Label 2', value: 'Value 2' },
                { name: 'Name 3', label: 'Label 3', value: '123456' },
                { name: 'Name 4', label: 'Label 4', value: '' },
                { name: 'Name 5', label: 'Label 5', value: null },
                { name: 'Name 6', label: 'Label 6', value: 0 },
                { name: 'Name 7', label: 'Label 7', value: undefined },
            ],
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(ContractFeatureAttribute).length).toBe(4);
        expect(wrapper.find('p').length).toBe(0);

        expect(wrapper.find(ContractFeatureAttribute.Name).at(0).text()).toBe('Label 1');
        expect(wrapper.find(ContractFeatureAttribute.Value).at(0).text()).toBe('123');

        expect(wrapper.find(ContractFeatureAttribute.Name).at(1).text()).toBe('Label 2');
        expect(wrapper.find(ContractFeatureAttribute.Value).at(1).text()).toBe('Value 2');

        expect(wrapper.find(ContractFeatureAttribute.Name).at(2).text()).toBe('Label 3');
        expect(wrapper.find(ContractFeatureAttribute.Value).at(2).text()).toBe('123456');

        expect(wrapper.find(ContractFeatureAttribute.Name).at(3).text()).toBe('Label 6');
        expect(wrapper.find(ContractFeatureAttribute.Value).at(3).text()).toBe('0');
    });
});
