import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import * as contractUtils from '../../../../../../utils/contracts/contracts';
import LoadingIcon from '../../../../shared/LoadingIcon';
import ContractList from '../ContractList';
import ContractListView from '../ContractListView';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve([]));

    const minProps = {
        objectId: 123456,
        currentLayer: {
            id: 123,
        },
        contractLayers: [{
            id: 123,
            name: 'test',
            contractIdField: 'contractId',
            contractDescriptionField: 'contractDescription',
            tiimeriLinkField: 'tiimeriUrl',
            caseManagementLinkField: 'caseManagementUrl',
            relations: [],
        }],
    };
    const props = prop || minProps;
    const wrapper = shallow(<ContractList {...props} />);
    return { wrapper };
};

describe.skip('<ContractList />', () => {
    const { wrapper } = setup();

    it('render - should render loading', () => {
        wrapper.setState({ fetchingContracts: true });
        expect(wrapper.find(LoadingIcon).exists()).toBe(true);
        expect(wrapper.find(ContractListView).exists()).toBe(false);
    });

    it('render - should render contract list view', () => {
        wrapper.setState({ fetchingContracts: false });
        expect(wrapper.find(LoadingIcon).exists()).toBe(false);
        expect(wrapper.find(ContractListView).exists()).toBe(true);
    });

    it('componentDidMount - should fetch contract-relation data and change state with no results', async () => {
        const contracts = [];
        const expectedResult = [];

        fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve(contracts));

        wrapper.instance().componentDidMount();
        wrapper.setState({ fetchingContracts: true });
        expect(fetchMock.fetchContractRelation).toHaveBeenCalled();

        await fetchMock.fetchContractRelation();
        await contractUtils.contractListTexts();
        expect(wrapper.state('contracts')).toEqual(expectedResult);
        expect(wrapper.state('fetchingContracts')).toEqual(false);
    });

    it('componentDidMount - should fetch contract-relation data and change state with results', async () => {
        const contracts = [{
            layerId: 123,
            features: [{
                attributes: {
                    tiimeriUrl: '123',
                    caseManagementUrl: '123',
                    contractId: 123,
                    contractDescription: 'Description field 1',
                },
            }, {
                attributes: {
                    tiimeriUrl: '456',
                    caseManagementUrl: '456',
                    contractId: 456,
                    contractDescription: 'Description field 2',
                },
            }],
        }];

        const expectedResult = [{
            contract: [{
                tiimeriUrl: 'http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=123',
                caseManagementUrl: 'http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=123',
                attributes: {
                    tiimeriUrl: '123',
                    caseManagementUrl: '123',
                    contractDescription: 'Description field 1',
                    contractId: 123,
                },
                contractUnlinkable: false,
                description: 'Description field 1',
                id: 123,
                layerId: 123,
            }, {
                tiimeriUrl: 'http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=456',
                caseManagementUrl: 'http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=456',
                attributes: {
                    tiimeriUrl: '456',
                    caseManagementUrl: '456',
                    contractDescription: 'Description field 2',
                    contractId: 456,
                },
                contractUnlinkable: false,
                description: 'Description field 2',
                id: 456,
                layerId: 123,
            }],
            name: 'test',
        }];

        fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve(contracts));

        wrapper.instance().componentDidMount();
        wrapper.setState({ fetchingContracts: true });
        expect(fetchMock.fetchContractRelation).toHaveBeenCalled();

        await fetchMock.fetchContractRelation();
        await contractUtils.contractListTexts();
        expect(wrapper.state('contracts')).toEqual(expectedResult);
        expect(wrapper.state('fetchingContracts')).toEqual(false);
    });
});
