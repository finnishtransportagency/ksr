import React from 'react';
import { shallow } from 'enzyme';
import * as fetchMock from '../../../../../../api/contract/contractRelations';
import * as contractUtils from '../../../../../../utils/contracts/contracts';
import LoadingIcon from '../../../../shared/LoadingIcon';
import ContractList from '../ContractList';
import ContractListView from '../ContractListView';

const setup = (prop) => {
    fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features: null }));

    const minProps = {
        layerId: 123,
        objectId: 123456,
        contractIdField: 'contractId',
        contractDescriptionField: 'contractDescription',
        alfrescoLinkField: 'alfrescoUrl',
        caseManagementLinkField: 'caseManagementUrl',
        currentLayer: {
            id: 123,
        },
        relationLayer: {
            id: 123,
        },
    };
    const props = prop || minProps;
    const wrapper = shallow(<ContractList {...props} />);
    return { wrapper };
};

describe('<ContractList />', () => {
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
        const features = null;
        const expectedResult = [];

        fetchMock.fetchContractRelation = jest.fn(() => Promise.resolve({ features }));

        wrapper.instance().componentDidMount();
        wrapper.setState({ fetchingContracts: true });
        expect(fetchMock.fetchContractRelation).toHaveBeenCalled();

        await fetchMock.fetchContractRelation();
        await contractUtils.contractListTexts();
        expect(wrapper.state('contracts')).toEqual(expectedResult);
        expect(wrapper.state('fetchingContracts')).toEqual(false);
    });

    it('componentDidMount - should fetch contract-relation data and change state with results', async () => {
        const contracts = {
            features: [{
                attributes: {
                    alfrescoUrl: '/alfrescourl/123',
                    caseManagementUrl: '/casemanagementurl/123',
                    contractId: 123,
                    contractDescription: 'Description field 1',
                },
            }, {
                attributes: {
                    alfrescoUrl: '/alfrescourl/456',
                    caseManagementUrl: '/casemanagementurl/456',
                    contractId: 456,
                    contractDescription: 'Description field 2',
                },
            }],
        };

        const expectedResult = [{
            alfrescoUrl: 'https://extranet.liikennevirasto.fi/share/page/dp/ws/faceted-search#searchTerm=/alfrescourl/123',
            caseManagementUrl: 'https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=/casemanagementurl/123',
            id: 123,
            description: 'Description field 1',
        }, {
            alfrescoUrl: 'https://extranet.liikennevirasto.fi/share/page/dp/ws/faceted-search#searchTerm=/alfrescourl/456',
            caseManagementUrl: 'https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=/casemanagementurl/456',
            id: 456,
            description: 'Description field 2',
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

