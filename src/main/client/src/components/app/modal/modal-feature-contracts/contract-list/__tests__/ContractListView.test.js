import React from 'react';
import { mount } from 'enzyme';
import strings from '../../../../../../translations';
import Contract from '../../../../../ui/blocks/Contract';

import ContractListView from '../ContractListView';

const setup = (prop) => {
    const minProps = {
        contracts: [],
        editLayerPermission: true,
    };

    const props = prop || minProps;
    const wrapper = mount(<ContractListView {...props} />);

    return { wrapper, minProps };
};

describe('<ContractListView />', () => {
    it('should render text with no contracts', () => {
        const props = {
            contracts: [],
            editLayerPermission: true,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(Contract).length).toBe(0);
        expect(wrapper.find('p').length).toBe(1);
        expect(wrapper.find('p').text()).toEqual(strings.modalFeatureContracts.listView.noContracts);
    });

    it('should render contracts', () => {
        const props = {
            contracts: [
                {
                    name: 'test',
                    contract: [
                        {
                            id: 1,
                            description: 'Test 1',
                        }, {
                            id: 2,
                            description: 'Test 2',
                        }, {
                            id: 3,
                            description: 'Test 3',
                        },
                    ],
                },
            ],
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(Contract).length).toBe(3);
        expect(wrapper.find('p').length).toBe(1);
    });

    it('should contain correct text', () => {
        const props = {
            contracts: [
                {
                    name: 'test',
                    contract: [
                        {
                            id: 1,
                            description: 'Test 1',
                        }, {
                            id: 2,
                            description: 'Test 2',
                        }, {
                            id: 3,
                            description: 'Test 3',
                        },
                    ],
                },
            ],
            editLayerPermission: true,
        };

        const { wrapper } = setup(props);

        expect(wrapper.find(Contract).at(0)
            .find(Contract.TextWrapper).find(Contract.TextWrapper.Text)
            .at(0)
            .text()).toEqual('1');
        expect(wrapper.find(Contract).at(0)
            .find(Contract.TextWrapper).find(Contract.TextWrapper.Text)
            .at(1)
            .text()).toEqual('Test 1');

        expect(wrapper.find(Contract).at(1)
            .find(Contract.TextWrapper).find(Contract.TextWrapper.Text)
            .at(0)
            .text()).toEqual('2');
        expect(wrapper.find(Contract).at(1)
            .find(Contract.TextWrapper).find(Contract.TextWrapper.Text)
            .at(1)
            .text()).toEqual('Test 2');

        expect(wrapper.find(Contract).at(2)
            .find(Contract.TextWrapper).find(Contract.TextWrapper.Text)
            .at(0)
            .text()).toEqual('3');
        expect(wrapper.find(Contract).at(2)
            .find(Contract.TextWrapper).find(Contract.TextWrapper.Text)
            .at(1)
            .text()).toEqual('Test 3');
    });
});
